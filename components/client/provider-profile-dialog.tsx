"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    ShieldCheck,
    MapPin,
    Briefcase,
    Calendar,
    Users,
    CheckCircle2,
    Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderProfileDialogProps {
    provider: {
        id: string;
        category: string;
        city: string;
        bio: string | null;
        verified: boolean;
        user: {
            name: string;
            image: string | null;
            createdAt: string;
        };
        _count: {
            requests: number;
        };
    };
    trigger?: React.ReactNode;
}

export function ProviderProfileDialog({ provider, trigger }: ProviderProfileDialogProps) {
    const yearsExperience = Math.max(1, new Date().getFullYear() - new Date(provider.user.createdAt).getFullYear());

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="link" className="p-0 h-auto font-bold text-blue-600 hover:text-blue-700">
                        View Profile
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
                {/* Accessibility Headers (Screen Reader Only) */}
                <DialogHeader className="sr-only">
                    <DialogTitle>Provider Profile - {provider.user.name}</DialogTitle>
                    <DialogDescription>
                        Detailed profile information for provider {provider.user.name} including bio, experience, and job history.
                    </DialogDescription>
                </DialogHeader>

                {/* Header/Cover */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-white/20">
                            {provider.user.image ? (
                                <img
                                    src={provider.user.image}
                                    alt={provider.user.name}
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                                    {provider.user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-8 pb-8 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{provider.user.name}</h2>
                            {provider.verified && (
                                <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-2 py-0 h-5 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-y-2 gap-x-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                                {provider.category}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                {provider.city}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                Joined {new Date(provider.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-4 text-center space-y-1 ring-1 ring-gray-100">
                            <div className="text-xl font-black text-gray-900">{provider._count.requests}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Jobs Done</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-center space-y-1 ring-1 ring-gray-100">
                            <div className="text-xl font-black text-gray-900">4.9</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rating</div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 text-center space-y-1 ring-1 ring-gray-100">
                            <div className="text-xl font-black text-gray-900">{yearsExperience}y+</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Experience</div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Background & Bio</h3>
                        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                {provider.bio || "No bio available for this provider. They are specialized in " + provider.category + " services in " + provider.city + "."}
                            </p>
                        </div>
                    </div>

                    {/* Achievements/Skills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-white text-gray-600 border-gray-100 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3 mr-1.5 text-green-500" />
                            Reliable
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-white text-gray-600 border-gray-100 text-[10px] font-bold">
                            <Award className="h-3 w-3 mr-1.5 text-amber-500" />
                            Top Rated
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-white text-gray-600 border-gray-100 text-[10px] font-bold">
                            <Users className="h-3 w-3 mr-1.5 text-blue-500" />
                            Trusted
                        </Badge>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

