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
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Macmiil Ratings</h2>
                            <p className="text-sm font-medium text-slate-500">
                                Waa aragtida macaamiisha aad u shaqeysay
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                                <span className="text-3xl font-black text-slate-900">{rating.toFixed(1)}</span>
                                <div className="flex flex-col items-start leading-none">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i <= Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{reviews.length} Reviews</span>
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[60vh] px-8 pb-8">
                    {reviews.length > 0 ? (
                        <div className="grid gap-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-lg transition-all duration-300 hover:border-amber-200/50">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg border border-slate-200">
                                                {review.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 leading-tight">{review.user.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {review.comment && (
                                        <div className="relative bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mt-2">
                                            <Quote className="absolute top-4 left-4 h-4 w-4 text-slate-300 opacity-50" />
                                            <p className="text-sm font-medium text-slate-600 pl-6 italic leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    )}

                                    {review.request?.category && (
                                        <div className="mt-4 flex justify-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-white px-2 py-1 rounded-lg border border-slate-100">
                                                {review.request.category}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <Star className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-1">Weli wax qiimeyn ah ma lihid</h3>
                            <p className="text-slate-500 max-w-xs text-sm">
                                Dhammaystir shaqooyinka si aad u hesho qiimeynta macaamiisha.
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
