"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import PostCard from "./post-card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { Post } from "@/types/post";

type SortOption = "newest" | "oldest" | "event-early" | "event-late";
type TabValue = "active" | "ended";

const getTimestamp = (dateString?: string): number => {
  return dateString ? new Date(dateString).getTime() : 0;
};

const getUpdatedTime = (post: Post): number => {
  return getTimestamp(post.updated_at || post.created_at);
};

const getStartTime = (post: Post): number => {
  return getTimestamp(post.start_time);
};

const getEndTime = (post: Post): number => {
  return getTimestamp(post.end_time);
};

const isPostActive = (post: Post, now: Date): boolean => {
  return post.end_time ? new Date(post.end_time) > now : false;
};

const compareByUpdatedTime = (a: Post, b: Post, ascending: boolean): number => {
  const diff = getUpdatedTime(a) - getUpdatedTime(b);
  return ascending ? diff : -diff;
};

const compareByEventTime = (a: Post, b: Post, sortBy: "event-early" | "event-late"): number => {
  const hasStartA = !!a.start_time;
  const hasStartB = !!b.start_time;
  const isAscending = sortBy === "event-early";

  // Handle posts without start_time (happening now)
  if (!hasStartA && !hasStartB) {
    const diff = getEndTime(a) - getEndTime(b);
    return isAscending ? diff : -diff;
  }
  if (!hasStartA) return isAscending ? -1 : 1;
  if (!hasStartB) return isAscending ? 1 : -1;

  // Both have start_time: sort by start_time first, then end_time
  const startDiff = getStartTime(a) - getStartTime(b);
  if (startDiff !== 0) {
    return isAscending ? startDiff : -startDiff;
  }

  const endDiff = getEndTime(a) - getEndTime(b);
  return isAscending ? endDiff : -endDiff;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabValue>("active");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("event-early");

  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }

    const allPosts = (data || []).map((item: Post) => ({
      ...item,
      location: item.location || "Location TBD",
      description: item.description || "No description available.",
    })) as Post[];

    setPosts(allPosts);
    setLoading(false);
  }, [supabase]);

  const filterAndSortPosts = useCallback(() => {
    const now = new Date();
    const filtered = posts.filter((post) => {
      const isActive = isPostActive(post, now);
      return activeTab === "active" ? isActive : !isActive;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest" || sortBy === "oldest") {
        return compareByUpdatedTime(a, b, sortBy === "oldest");
      }
      return compareByEventTime(a, b, sortBy as "event-early" | "event-late");
    });

    setFilteredPosts(sorted);
  }, [activeTab, posts, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    filterAndSortPosts();
  }, [filterAndSortPosts]);

  useEffect(() => {
    const handlePostCreated = () => {
      fetchPosts();
    };
    
    window.addEventListener("postCreated", handlePostCreated);
    return () => {
      window.removeEventListener("postCreated", handlePostCreated);
    };
  }, [fetchPosts]);

  return (
    <div className="w-full">
      {/* Header with Tabs and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-auto">
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger 
                value="active" 
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "active"
                    ? "border border-input hover:bg-accent hover:text-accent-foreground"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="ended" 
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "ended"
                    ? "border border-input hover:bg-accent hover:text-accent-foreground"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Ended
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSortBy("event-early")}
              className="cursor-pointer"
            >
              Earliest Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("event-late")}
              className="cursor-pointer"
            >
              Latest Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("newest")}
              className="cursor-pointer"
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("oldest")}
              className="cursor-pointer"
            >
              Oldest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
          There&apos;s nothing here yet.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
