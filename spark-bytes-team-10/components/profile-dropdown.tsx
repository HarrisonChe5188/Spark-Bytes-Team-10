"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase
          .from("user_info")
          .select("nickname, image_url")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Failed to load user_info", error);
          return;
        }
        if (!mounted) return;
        setNickname(data?.nickname ?? null);
        setAvatarUrl(data?.image_url ?? null);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={nickname ?? "avatar"}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <User size={20} className="text-muted-foreground" />
          )}
          {nickname && (
            <span className="hidden sm:inline text-sm">{nickname}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
