"use client";

import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationItem } from "../types";
import { useNotifications } from "../hooks/useNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NotificationBellProps {
  initialNotifications: NotificationItem[];
}

export default function NotificationBell({
  initialNotifications,
}: NotificationBellProps) {
  const {
    notifications,
    unreadCount,
    isOpen,
    handleOpen,
    handleMarkRead,
    handleMarkAllRead,
  } = useNotifications(initialNotifications);

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          className='relative p-2 rounded-full hover:bg-white/5 transition-colors'
          aria-label='Notifications'
        >
          <Bell className='w-5 h-5 text-slate-300' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 w-4 h-4 bg-[#E7C9A5] text-[#05070A] text-[10px] font-bold rounded-full flex items-center justify-center leading-none'>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className='w-80 p-0 bg-[#0F1117] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-slate-800'>
          <div className='flex items-center gap-2'>
            <h3 className='text-white font-semibold text-sm'>Notifications</h3>
            {unreadCount > 0 && (
              <span className='bg-[#E7C9A5]/20 text-[#E7C9A5] text-xs font-bold px-1.5 py-0.5 rounded-full'>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className='text-xs text-slate-400 hover:text-[#E7C9A5] transition-colors'
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className='max-h-[340px] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 gap-2'>
              <Bell className='w-8 h-8 text-slate-700' />
              <p className='text-slate-500 text-sm'>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onRead={handleMarkRead}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: NotificationItem;
  onRead: (id: string) => void;
}) {
  return (
    <button
      onClick={() => !notification.isRead && onRead(notification.id)}
      className='w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left border-b border-slate-800/60 last:border-0'
    >
      {/* Unread dot */}
      <span
        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
          notification.isRead ? "bg-transparent" : "bg-[#E7C9A5]"
        }`}
      />
      <div className='flex-1 min-w-0'>
        <p
          className={`text-sm leading-snug ${
            notification.isRead ? "text-slate-400" : "text-white"
          }`}
        >
          {notification.message}
        </p>
        <p className='text-xs text-slate-600 mt-1'>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </button>
  );
}
