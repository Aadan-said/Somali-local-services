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
                <Button variant="outline" size="sm" className="gap-2 font-bold hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 transition-all border-gray-100 shadow-sm">
                    <Star className="h-4 w-4" />
                    Review Service
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-yellow-400 via-purple-500 to-blue-500" />
                <DialogHeader className="pt-4">
                    <DialogTitle className="text-2xl font-black text-gray-900">How was the service?</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Share your experience with <span className="font-bold text-purple-600">{providerName}</span>. Your feedback helps others in the community.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-8">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="transition-all hover:scale-125 focus:outline-none"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={cn(
                                        "h-10 w-10",
                                        (hover || rating) >= star
                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                            : "text-gray-200"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Your Comment (Optional)</label>
                        <Textarea
                            placeholder="Tell us what you liked or what could be improved..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="w-full rounded-full h-12 text-md font-bold bg-linear-to-br from-yellow-400 to-orange-500 hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-100"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
