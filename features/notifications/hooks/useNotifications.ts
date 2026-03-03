"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { NotificationItem } from "../types";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../actions/notifications";

const POLL_INTERVAL_MS = 10_000;

export function useNotifications(initialNotifications: NotificationItem[]) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchLatest = useCallback(async () => {
    try {
      const latest = await getNotifications();
      setNotifications(latest);
    } catch (err) {
      console.error("Failed to poll notifications:", err);
    }
  }, []);

  // Start polling on mount, stop on unmount
  useEffect(() => {
    intervalRef.current = setInterval(fetchLatest, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchLatest]);

  // Also refresh immediately when the dropdown opens
  useEffect(() => {
    if (isOpen) fetchLatest();
  }, [isOpen, fetchLatest]);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    startTransition(async () => {
      await markNotificationRead(id);
    });
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  }, []);

  const handleOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    notifications,
    unreadCount,
    isOpen,
    isPending,
    handleOpen,
    handleMarkRead,
    handleMarkAllRead,
  };
}
