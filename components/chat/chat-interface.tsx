"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
        name: string;
        image: string | null;
        id: string;
    };
}

interface ChatInterfaceProps {
    conversationId: string;
    currentUserId: string;
    recipientName: string;
    onClose?: () => void;
}

export function ChatInterface({ conversationId, currentUserId, recipientName, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                body: JSON.stringify({ conversationId, content: newMessage }),
            });
            const data = await res.json();
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    // Group consecutive messages from the same sender
    const groupedMessages = messages.reduce((groups: Message[][], message, index) => {
        if (index === 0 || messages[index - 1].senderId !== message.senderId) {
            groups.push([message]);
        } else {
            groups[groups.length - 1].push(message);
        }
        return groups;
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#efeae2] dark:bg-background relative transition-colors duration-300">
            {/* WhatsApp-style Background Pattern - Adaptive Opacity */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat pointer-events-none z-0" />

            {/* Header - Glassy look in Dark Mode */}
            <div className="relative z-10 flex items-center justify-between px-3 py-3 bg-[#008069] dark:bg-card/80 dark:border-b dark:border-border dark:backdrop-blur-xl text-white shadow-md">
                <div className="flex items-center gap-2">
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/10 rounded-full h-10 w-10 sm:hidden"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="h-10 w-10 circle-rounded bg-background/20 dark:bg-primary/20 border border-white/20 flex items-center justify-center text-white dark:text-primary font-bold text-sm overflow-hidden">
                        {recipientName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-base leading-tight">{recipientName}</p>
                        <p className="text-[11px] text-white/80 font-medium">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4 py-2 relative z-10">
                <div className="space-y-4 pb-4 min-h-[calc(100vh-140px)] sm:min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center pt-20">
                            <Loader2 className="h-8 w-8 animate-spin text-[#008069] dark:text-primary" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center pt-20 text-center px-6">
                            <div className="bg-[#e1f3fb] dark:bg-primary/20 p-4 rounded-full mb-4 shadow-sm">
                                <Send className="h-8 w-8 text-[#008069] dark:text-primary" />
                            </div>
                            <p className="text-sm font-bold text-gray-800 dark:text-foreground bg-white/60 dark:bg-card/40 p-2 rounded-lg backdrop-blur-sm border border-white/20 dark:border-border">
                                Bilow wada hadalka, fariimahaagu waa qarsoodi.
                            </p>
                        </div>
                    ) : (
                        groupedMessages.map((group, groupIndex) => {
                            const isMe = group[0].senderId === currentUserId;
                            return (
                                <div key={groupIndex} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                    {group.map((message, msgIndex) => {
                                        const isLastInGroup = msgIndex === group.length - 1;
                                        const isFirstInGroup = msgIndex === 0;

                                        return (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    "relative px-4 py-2 max-w-[85%] sm:max-w-[70%] text-[15px] leading-snug shadow-sm mb-0.5 transition-all duration-300",
                                                    isMe
                                                        ? "bg-[#d9fdd3] dark:bg-primary/20 dark:text-foreground dark:border dark:border-primary/20 rounded-lg rounded-tr-none"
                                                        : "bg-white dark:bg-muted dark:text-foreground dark:border dark:border-border rounded-lg rounded-tl-none",
                                                    isFirstInGroup && isMe && "rounded-tr-none",
                                                    isFirstInGroup && !isMe && "rounded-tl-none",
                                                    !isFirstInGroup && "rounded-lg"
                                                )}
                                            >
                                                {/* Tail for first message in group */}
                                                {isFirstInGroup && (
                                                    <span className={cn(
                                                        "absolute top-0 w-0 h-0 border-8 border-transparent transition-colors duration-300",
                                                        isMe
                                                            ? "-right-[8px] border-t-[#d9fdd3] dark:border-t-primary/20 border-l-[#d9fdd3] dark:border-l-primary/20"
                                                            : "-left-[8px] border-t-white dark:border-t-muted border-r-white dark:border-r-muted"
                                                    )} />
                                                )}

                                                <p className="whitespace-pre-wrap wrap-break-word font-medium">{message.content}</p>

                                                <div className={cn(
                                                    "text-[10px] mt-1 flex items-center gap-1 opacity-60 font-bold",
                                                    isMe ? "justify-end" : "justify-start"
                                                )}>
                                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMe && <span className="text-blue-500 dark:text-primary font-black text-[10px]">✓✓</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} className="h-4" />
                </div>
            </ScrollArea>

            {/* Input Area - Integrated Look */}
            <div className="relative z-10 p-2 bg-[#f0f2f5] dark:bg-card/40 dark:backdrop-blur-xl dark:border-t dark:border-border min-h-[60px] flex items-center gap-2">
                <div className="flex-1 bg-white dark:bg-muted/50 rounded-2xl flex items-center px-4 py-2 shadow-sm border border-gray-100 dark:border-border">
                    <Input
                        placeholder="Fariintaada qor..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-base placeholder:text-gray-400 dark:placeholder:text-muted-foreground font-medium"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(e);
                            }
                        }}
                    />
                </div>
                <Button
                    onClick={sendMessage}
                    size="icon"
                    disabled={sending || !newMessage.trim()}
                    className={cn(
                        "rounded-full h-12 w-12 shrink-0 transition-all duration-300 active:scale-95 shadow-md border-0",
                        newMessage.trim()
                            ? "bg-[#008069] dark:bg-primary hover:bg-[#006d59] dark:hover:bg-primary/90 text-white shadow-primary/20"
                            : "bg-gray-200 dark:bg-muted text-gray-400 dark:text-muted-foreground"
                    )}
                >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </Button>
            </div>
        </div>
    );
}

