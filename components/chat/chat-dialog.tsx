"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "./chat-interface";

interface ChatDialogProps {
    requestId: string;
    currentUserId: string;
    recipientName: string;
    triggerLabel?: string;
}

export function ChatDialog({ requestId, currentUserId, recipientName, triggerLabel = "Chat" }: ChatDialogProps) {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/chat/conversations", {
                method: "POST",
                body: JSON.stringify({ requestId }),
            });
            const data = await res.json();
            if (data.id) {
                setConversationId(data.id);
                setOpen(true);
            }
        } catch (error) {
            console.error("Error opening chat:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant="outline"
                size="sm"
                className="gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all border-border shadow-sm rounded-xl px-4 h-9"
                onClick={handleOpen}
                disabled={loading}
            >
                <MessageCircle className="h-3.5 w-3.5" />
                {triggerLabel}
            </Button>
            <DialogContent className="sm:max-w-md w-full p-0 gap-0 overflow-hidden sm:rounded-4xl border-0 sm:border border-border shadow-none sm:shadow-2xl h-dvh sm:h-[600px] flex flex-col bg-[#efeae2] dark:bg-background translate-y-0 top-0 sm:top-[50%] sm:-translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-10 data-[state=open]:slide-in-from-bottom-10 sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%] duration-500">
                {conversationId && (
                    <>
                        <div className="sr-only">
                            <DialogTitle>Chat with {recipientName}</DialogTitle>
                        </div>
                        <ChatInterface
                            conversationId={conversationId}
                            currentUserId={currentUserId}
                            recipientName={recipientName}
                            onClose={() => setOpen(false)}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
