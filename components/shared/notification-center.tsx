"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Info, ExternalLink } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link: string | null;
    createdAt: string;
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                body: JSON.stringify({ id, readAll: !id }),
            });
            fetchNotifications();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "REQUEST_UPDATE": return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case "MESSAGE": return <MessageSquare className="h-4 w-4 text-purple-500" />;
            case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            default: return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-white/10 text-white rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 shrink-0 transition-all">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                                {unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4 mt-2 overflow-hidden border-gray-100 shadow-2xl rounded-2xl" align="end">
                <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-600 to-blue-600 text-white">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-white/80 hover:text-white hover:bg-white/10 h-7"
                        onClick={() => markAsRead()}
                    >
                        Mark all as read
                    </Button>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                            <Bell className="h-8 w-8 text-gray-200" />
                            <p className="text-xs">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative cursor-pointer",
                                    !n.read && "bg-blue-50/50"
                                )}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1">{getIcon(n.type)}</div>
                                    <div className="space-y-1">
                                        <p className={cn("text-xs font-bold leading-none", !n.read ? "text-gray-900" : "text-gray-600")}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {n.message}
                                        </p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                className="text-[10px] text-purple-600 font-bold flex items-center gap-1 mt-1 hover:underline"
                                            >
                                                View details <ExternalLink className="h-2 w-2" />
                                            </Link>
                                        )}
                                        <p className="text-[10px] text-gray-400">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!n.read && (
                                        <div className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
