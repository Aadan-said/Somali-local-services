"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
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
}

export function ChatInterface({ conversationId, currentUserId, recipientName }: ChatInterfaceProps) {
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
        <div className="flex flex-col h-full bg-[#efeae2]">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-[#f0f2f5] border-b border-gray-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {recipientName.charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{recipientName}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full" />
                        Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-full py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                <Send className="h-7 w-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">No messages yet</p>
                            <p className="text-xs text-gray-400 mt-1">Start the conversation!</p>
                        </div>
                    ) : (
                        groupedMessages.map((group, groupIndex) => {
                            const isMe = group[0].senderId === currentUserId;
                            const senderName = isMe ? "You" : group[0].sender.name;
                            return (
                                <div key={groupIndex} className="mb-3">
                                    {/* Sender Name Label */}
                                    <p className={cn(
                                        "text-[11px] font-semibold mb-1 px-1",
                                        isMe ? "text-right text-gray-600" : "text-left text-gray-700"
                                    )}>
                                        {senderName}
                                    </p>

                                    <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn("flex flex-col gap-0.5 max-w-[75%]")}>
                                            {group.map((message, msgIndex) => (
                                                <div
                                                    key={message.id}
                                                    className={cn(
                                                        "px-3 py-2",
                                                        isMe
                                                            ? "bg-[#d9fdd3] text-gray-900 shadow-sm"
                                                            : "bg-white text-gray-900 border border-gray-300 shadow-sm",
                                                        msgIndex === 0 && isMe && "rounded-tl-lg rounded-tr-lg rounded-bl-lg",
                                                        msgIndex === 0 && !isMe && "rounded-tl-lg rounded-tr-lg rounded-br-lg",
                                                        msgIndex > 0 && msgIndex < group.length - 1 && isMe && "rounded-tl-lg rounded-bl-lg",
                                                        msgIndex > 0 && msgIndex < group.length - 1 && !isMe && "rounded-tr-lg rounded-br-lg",
                                                        msgIndex === group.length - 1 && msgIndex > 0 && isMe && "rounded-tl-lg rounded-bl-lg rounded-br-sm",
                                                        msgIndex === group.length - 1 && msgIndex > 0 && !isMe && "rounded-tr-lg rounded-br-lg rounded-bl-sm"
                                                    )}
                                                >
                                                    <p className="text-[14px] leading-[1.4] break-words">{message.content}</p>
                                                    {msgIndex === group.length - 1 && (
                                                        <p className={cn("text-[11px] mt-1 text-right", isMe ? "text-gray-600" : "text-gray-500")}>
                                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 rounded-full bg-white border-gray-300 focus:ring-1 focus:ring-[#00a884] focus:border-[#00a884] h-10"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={sending || !newMessage.trim()}
                        className="rounded-full h-10 w-10 bg-[#00a884] hover:bg-[#008f6f] disabled:bg-gray-300"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
