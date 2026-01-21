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
            const res = await fetch("/api/notifications", { cache: "no-store" });
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
                <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full transition-all duration-300">
                    <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 shrink-0 transition-all">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center border-2 border-background">
                                {unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4 mt-2 overflow-hidden border-border bg-background dark:bg-card/95 backdrop-blur-xl shadow-2xl rounded-2xl ring-1 ring-border" align="end">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-blue-600 dark:from-primary/90 dark:to-blue-600/90 text-white shadow-lg">
                    <h3 className="font-black text-xs uppercase tracking-widest">Wargelin</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-white/80 hover:text-white hover:bg-white/10 h-7 font-black uppercase tracking-tighter"
                        onClick={() => markAsRead()}
                    >
                        Mark all as read
                    </Button>
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                                <Bell className="h-8 w-8 text-muted/30" />
                            </div>
                            <p className="text-xs font-bold">Weli ma jiraan wargelin kugu cusub</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-4 border-b border-border/40 hover:bg-muted/50 transition-all relative cursor-pointer group",
                                    !n.read && "bg-primary/3 dark:bg-primary/5"
                                )}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1 transition-transform group-hover:scale-110 duration-300">{getIcon(n.type)}</div>
                                    <div className="space-y-1.5">
                                        <p className={cn("text-xs font-black leading-tight tracking-tight", !n.read ? "text-foreground" : "text-muted-foreground")}>
                                            {n.title}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                                            {n.message}
                                        </p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                className="text-[10px] text-primary font-black flex items-center gap-1 mt-1 hover:underline uppercase tracking-tighter"
                                            >
                                                Eeg faahfaahinta <ExternalLink className="h-2 w-2" />
                                            </Link>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-1 w-1 rounded-full bg-border" />
                                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                {new Date(n.createdAt).toLocaleDateString('so-SO', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {!n.read && (
                                        <div className="absolute top-5 right-4 h-2 w-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
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

