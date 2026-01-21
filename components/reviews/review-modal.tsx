"use client";

import { useState } from "react";
import { Star, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
    requestId: string;
    providerId: string;
    providerName: string;
    onSuccess?: () => void;
}

export function ReviewModal({ requestId, providerId, providerName, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                body: JSON.stringify({ requestId, providerId, rating, comment }),
            });
            if (res.ok) {
                setOpen(false);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-all border-border bg-card shadow-sm rounded-xl">
                    <Star className="h-3.5 w-3.5" />
                    Review Service
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-0 overflow-hidden border-border bg-background dark:bg-card/95 backdrop-blur-xl ring-1 ring-border shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-primary to-blue-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <DialogHeader className="pt-8 px-8">
                    <DialogTitle className="text-2xl font-black text-foreground tracking-tight">How was the service?</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium mt-2">
                        Share your experience with <span className="font-black text-primary">{providerName}</span>. Your feedback helps others in the community.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-8 py-10 px-8">
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="transition-all hover:scale-125 focus:outline-none group"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={cn(
                                        "h-10 w-10 transition-all duration-300",
                                        (hover || rating) >= star
                                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                            : "text-muted-foreground/20 group-hover:text-amber-400/50"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full space-y-2.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Your Comment (Optional)</label>
                        <Textarea
                            placeholder="Tell us what you liked or what could be improved..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[120px] rounded-2xl border-border bg-muted/40 focus:bg-muted/60 focus:ring-1 focus:ring-primary/20 transition-all resize-none font-medium placeholder:text-muted-foreground/40 text-foreground"
                        />
                    </div>
                </div>

                <DialogFooter className="p-8 pt-0">
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="w-full rounded-2xl h-14 text-xs font-black uppercase tracking-widest bg-gradient-to-br from-amber-400 to-orange-500 hover:to-orange-600 text-white shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all border-0"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

