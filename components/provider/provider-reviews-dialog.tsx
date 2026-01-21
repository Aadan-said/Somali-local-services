"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, User, Quote, Calendar } from "lucide-react";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string;
    };
    request?: {
        category: string;
    }
}

interface ProviderReviewsDialogProps {
    reviews: Review[];
    rating: number;
    trigger: React.ReactNode;
}

export function ProviderReviewsDialog({ reviews, rating, trigger }: ProviderReviewsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background dark:bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden ring-1 ring-border">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <DialogHeader className="p-8 pb-4 relative z-10">
                    <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground tracking-tight">Macmiil Ratings</h2>
                            <p className="text-sm font-medium text-muted-foreground">
                                Waa aragtida macaamiisha aad u shaqeysay
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                <span className="text-3xl font-black text-foreground">{rating.toFixed(1)}</span>
                                <div className="flex flex-col items-start leading-none">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i <= Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/20'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-muted-foreground/60 mt-1 uppercase tracking-widest">{reviews.length} Reviews</span>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[60vh] px-8 pb-8 relative z-10 custom-scrollbar">
                    {reviews.length > 0 ? (
                        <div className="grid gap-4 pb-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-4xl p-6 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500 hover:border-amber-500/30 hover:-translate-y-1">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/60 font-black text-lg border border-border">
                                                {review.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground leading-tight">{review.user.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(review.createdAt).toLocaleDateString('so-SO', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 bg-amber-500/10 px-2 py-1.5 rounded-xl border border-amber-500/20 shadow-sm">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/20'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {review.comment && (
                                        <div className="relative bg-muted/40 rounded-2xl p-5 border border-border/40 mt-2 transition-colors group-hover:bg-muted/60">
                                            <Quote className="absolute top-4 left-4 h-4 w-4 text-muted-foreground/10" />
                                            <p className="text-sm font-medium text-muted-foreground pl-6 italic leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    )}

                                    {review.request?.category && (
                                        <div className="mt-4 flex justify-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 bg-muted/50 px-3 py-1 rounded-lg border border-border/50">
                                                {review.request.category}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-muted/20 rounded-4xl border border-dashed border-border/50">
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6 shadow-inner ring-1 ring-border">
                                <Star className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-2">Weli wax qiimeyn ah ma lihid</h3>
                            <p className="text-muted-foreground max-w-xs text-sm font-medium">
                                Dhammaystir shaqooyinka si aad u hesho qiimeynta macaamiisha iyo dhibco fiican.
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
