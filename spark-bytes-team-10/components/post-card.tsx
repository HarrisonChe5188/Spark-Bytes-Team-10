"use client";

import { Button } from "./ui/button";
import { Clock, MapPin } from "lucide-react";
import { Post } from "@/types/post";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EST_TIMEZONE = 'America/New_York';

const estFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: EST_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

export default function PostCard({ post }: PostCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInterested = async () => {
    if (isLoading || !post.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: post.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reserve food');
      }

      setIsReserved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  const formatPostedTime = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getESTParts = (date: Date) => {
    const parts = estFormatter.formatToParts(date);
    return {
      year: parseInt(parts.find(p => p.type === 'year')?.value || '0'),
      month: parseInt(parts.find(p => p.type === 'month')?.value || '0'),
      day: parseInt(parts.find(p => p.type === 'day')?.value || '0'),
      hour: parseInt(parts.find(p => p.type === 'hour')?.value || '0'),
      minute: parseInt(parts.find(p => p.type === 'minute')?.value || '0')
    };
  };

  const getNowEST = () => getESTParts(new Date());

  const isSameDay = (date1: ReturnType<typeof getESTParts>, date2: ReturnType<typeof getESTParts>) => {
    return date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
  };

  const isToday = (dateEST: ReturnType<typeof getESTParts>) => {
    const nowEST = getNowEST();
    return isSameDay(dateEST, nowEST);
  };

  const isTomorrow = (dateEST: ReturnType<typeof getESTParts>) => {
    const nowEST = getNowEST();
    const tomorrowEST = new Date(nowEST.year, nowEST.month - 1, nowEST.day + 1);
    return dateEST.year === tomorrowEST.getFullYear() &&
           dateEST.month === tomorrowEST.getMonth() + 1 &&
           dateEST.day === tomorrowEST.getDate();
  };

  const formatTimeOnly = (dateTimeString: string): string => {
    const dateEST = getESTParts(new Date(dateTimeString));
    const hour12 = dateEST.hour % 12 || 12;
    const ampm = dateEST.hour >= 12 ? 'PM' : 'AM';
    return `${hour12}:${String(dateEST.minute).padStart(2, '0')} ${ampm}`;
  };

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return null;
    
    const dateEST = getESTParts(new Date(dateTimeString));
    const timeStr = formatTimeOnly(dateTimeString);
    
    if (isToday(dateEST)) {
      return `Today at ${timeStr}`;
    } else if (isTomorrow(dateEST)) {
      return `Tomorrow at ${timeStr}`;
    } else {
      return `${MONTH_NAMES[dateEST.month - 1]} ${dateEST.day} at ${timeStr}`;
    }
  };

  const formatCreatedDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const isPostEnded = () => {
    if (!post.end_time) return false;
    return new Date(post.end_time) < new Date();
  };

  const formatNowToEndTime = (endTime: string): string => {
    const dateEST = getESTParts(new Date(endTime));
    return isToday(dateEST)
      ? `Now to ${formatTimeOnly(endTime)}`
      : `Now to ${formatDateTime(endTime)}`;
  };

  const formatTimeRange = (startTime: string, endTime: string): string => {
    const startEST = getESTParts(new Date(startTime));
    const endEST = getESTParts(new Date(endTime));
    
    if (!isSameDay(startEST, endEST)) {
      return `${formatDateTime(startTime)} - ${formatDateTime(endTime)}`;
    }
    
    const startTimeStr = formatTimeOnly(startTime);
    const endTimeStr = formatTimeOnly(endTime);
    
    if (isToday(startEST)) {
      return `Today from ${startTimeStr} - ${endTimeStr}`;
    } else if (isTomorrow(startEST)) {
      return `Tomorrow from ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `${MONTH_NAMES[startEST.month - 1]} ${startEST.day} from ${startTimeStr} - ${endTimeStr}`;
    }
  };

  return (
    <div className="p-5 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 pr-4">
          {post.title}
        </h2>
        {post.created_at && (
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatPostedTime(post.created_at)}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock size={16} className="text-gray-400 dark:text-gray-500" />
          <span>
            {isPostEnded() && post.created_at
              ? formatCreatedDate(post.created_at)
              : post.start_time && post.end_time
              ? formatTimeRange(post.start_time, post.end_time)
              : post.start_time
              ? formatDateTime(post.start_time)
              : post.end_time
              ? formatNowToEndTime(post.end_time)
              : "Now"}
          </span>
        </div>
        
        {post.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
            <span>{post.location}</span>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 pt-1">
          {post.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              {post.description}
            </p>
          )}
          {!isPostEnded() && (
            <div className="flex flex-col items-start md:items-end gap-1">
              <Button 
                onClick={handleInterested}
                disabled={isLoading || isReserved}
                className={`font-medium md:ml-auto self-start md:self-auto whitespace-nowrap ${
                  isReserved 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
                size="sm"
              >
                {isLoading ? 'Reserving...' : isReserved ? '✓ Reserved' : "I'm interested"}
              </Button>
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
