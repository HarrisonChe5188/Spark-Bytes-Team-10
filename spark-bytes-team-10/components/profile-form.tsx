"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

// This function creates a cropped image blob using canvas
async function getCroppedImg(imageSrc: string, pixelCrop: any, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const bBoxWidth =
    Math.abs(image.width * Math.cos(rotRad)) +
    Math.abs(image.height * Math.sin(rotRad));
  const bBoxHeight =
    Math.abs(image.width * Math.sin(rotRad)) +
    Math.abs(image.height * Math.cos(rotRad));

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.translate(-pixelCrop.x, -pixelCrop.y);

  ctx.save();
  // move to center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export default function ProfileForm({
  userId,
  initialNickname = "",
  initialAvatarUrl = null,
}: {
  userId: string;
  initialNickname?: string;
  initialAvatarUrl?: string | null;
}) {
  const supabase = createClient();
  const [nickname, setNickname] = useState(initialNickname);
  const [isEditingNickname, setIsEditingNickname] = useState(!initialNickname);
  const [savedNickname, setSavedNickname] = useState<string | null>(
    initialNickname || null
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialAvatarUrl);
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(
    initialAvatarUrl || null
  );
  const [loading, setLoading] = useState(false);

  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixelsParam: any) => {
    setCroppedAreaPixels(croppedAreaPixelsParam);
  }, []);

  const resetForm = () => {
    // Revoke object URL if we created one from a local file
    try {
      if (file && preview) {
        URL.revokeObjectURL(preview);
      }
    } catch (e) {
      // ignore
    }

    setNickname(savedNickname ?? initialNickname ?? "");
    setFile(null);
    setPreview(savedAvatarUrl ?? initialAvatarUrl ?? null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setIsEditingNickname(!(savedNickname ?? initialNickname));
  };

  // Fetch saved profile from Supabase on mount and when auth state changes
  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        if (!userId) return;
        const { data, error } = await supabase
          .from("userinfo")
          .select("nickname, avatar_url")
          .eq("id", userId)
          .single();

        if (error) {
          // silent: may simply be no row yet
          console.debug("No saved profile or fetch error:", error.message);
          return;
        }

        if (!mounted) return;

        if (data) {
          setNickname(data.nickname ?? "");
          setSavedNickname(data.nickname ?? null);
          setPreview(data.avatar_url ?? null);
          setSavedAvatarUrl(data.avatar_url ?? null);
          setIsEditingNickname(!data.nickname);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      }
    };

    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, _session: any) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          fetchProfile();
        }
      }
    );

    return () => {
      mounted = false;
      // unsubscribe listener if available
      try {
        if (authListener?.subscription?.unsubscribe) {
          authListener.subscription.unsubscribe();
        }
      } catch (e) {
        // ignore
      }
    };
  }, [userId]);

  const uploadAndSave = async () => {
    if (!userId) return alert("No user id available");
    setLoading(true);
    try {
      let avatarUrl = initialAvatarUrl;

      if (file) {
        // If cropping data isn't ready, fall back to uploading the original file.
        let uploadBlob: Blob | null = null;

        try {
          if (croppedAreaPixels) {
            const imageSrc = preview as string;
            const cropped = await getCroppedImg(
              imageSrc,
              croppedAreaPixels,
              rotation
            );
            if (!cropped) throw new Error("Failed to crop image");
            uploadBlob = cropped;
          } else {
            // No crop available yet — use original file
            uploadBlob = file;
          }
        } catch (cropErr) {
          console.error("Crop failed, falling back to original file:", cropErr);
          uploadBlob = file;
        }

        // preserve extension if possible
        const extMatch = (file.name || "").match(/\.([a-zA-Z0-9]+)$/);
        const ext = extMatch ? `.${extMatch[1]}` : ".png";
        const path = `avatars/${userId}/avatar${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, uploadBlob as Blob, { upsert: true });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw uploadError;
        }

        const { data: publicData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        avatarUrl = publicData?.publicUrl ?? null;
      }

      const { error: dbError } = await supabase.from("userinfo").upsert({
        id: userId,
        nickname: nickname || null,
        avatar_url: avatarUrl,
      });

      if (dbError) throw dbError;

      // Update UI to reflect saved state: show greeting immediately
      setIsEditingNickname(false);
      if (avatarUrl) setPreview(avatarUrl);
      setFile(null);
      setCroppedAreaPixels(null);
      // persist last-saved values for Reset behavior
      setSavedNickname(nickname || null);
      setSavedAvatarUrl(avatarUrl ?? null);

      alert("Profile saved");
    } catch (err: any) {
      console.error("Profile save error:", err);
      // Try to extract useful info from Supabase error objects
      const message =
        err?.message ||
        err?.error?.message ||
        JSON.stringify(err) ||
        "Unknown error";
      alert(`Failed to save profile: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Nickname
        </label>

        {isEditingNickname ? (
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="What should people call you?"
          />
        ) : (
          <div className="mt-1 flex items-center justify-between">
            <div className="text-lg"> {nickname}</div>
            <button
              type="button"
              className="text-sm text-gray-500 underline"
              onClick={() => setIsEditingNickname(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Avatar
        </label>
        <input type="file" accept="image/*" onChange={onFileChange} />

        {preview && (
          <div className="mt-3">
            <div className="relative w-full h-72 bg-gray-50">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex gap-2 mt-3">
              <label className="flex-1">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="w-32">
                Rotate
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={uploadAndSave} disabled={loading}>
          {loading ? "Saving…" : "Save profile"}
        </Button>
        <Button onClick={resetForm} disabled={loading}>
          Reset
        </Button>
      </div>
    </div>
  );
}
