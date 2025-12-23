"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Heart, Mail, UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Notification {
  id: number;
  type: "comment" | "like" | "invite" | "join_request" | "follow";
  user: string;
  message: string;
  time: string;
  read: boolean;
  postId?: string;
  groupId?: string;
  userId?: string;
  actionId?: number;
}

export default function NotificationPopover() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "comment",
      user: "이지현",
      message: "당신의 게시물에 댓글을 남겼습니다",
      time: "5분 전",
      read: false,
      postId: "1",
    },
    {
      id: 2,
      type: "like",
      user: "박준호",
      message: "당신의 게시물을 좋아합니다",
      time: "1시간 전",
      read: false,
      postId: "1",
    },
    {
      id: 3,
      type: "invite",
      user: "김민수",
      message: "당신을 그룹에 초대했습니다",
      time: "2시간 전",
      read: false,
      groupId: "2",
      actionId: 3,
    },
    {
      id: 4,
      type: "join_request",
      user: "최영미",
      message: "그룹에 가입을 요청했습니다",
      time: "3시간 전",
      read: true,
      groupId: "1",
      actionId: 4,
    },
    {
      id: 5,
      type: "follow",
      user: "이준영",
      message: "당신을 팔로우했습니다",
      time: "1일 전",
      read: true,
      userId: "5",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleAccept = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleReject = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "invite":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "join_request":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);

    if (notification.type === "comment" || notification.type === "like") {
      if (notification.postId) {
        router.push(`/posts/${notification.postId}`);
      }
    } else if (notification.type === "invite" || notification.type === "join_request") {
      router.push(`/invitations`);
    } else if (notification.type === "follow") {
      if (notification.userId) {
        router.push(`/users/${notification.userId}`);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">알림</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">새로운 알림이 없습니다</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{notification.user}</p>
                    <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {(notification.type === "invite" || notification.type === "join_request") && (
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAccept(notification.id)}
                      >
                        <Check className="h-3 w-3 text-green-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => handleReject(notification.id)}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full text-sm text-primary hover:text-primary/80"
            onClick={() => router.push("/notifications")}
          >
            모든 알림 보기
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
