"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, Briefcase, ShoppingBag, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!session) return null;

    const isProvider = session.user.role === "PROVIDER";

    const handleGetStarted = () => {
        setIsLoading(true);
        if (isProvider) {
            router.push("/provider/profile");
        } else {
            router.push("/client/create-request");
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] relative overflow-hidden flex items-center justify-center p-6">
            {/* Animated Background blobs similar to dashboard */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse duration-7000" />
            </div>

            <Card className="max-w-xl w-full border-gray-100 shadow-2xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
                <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 w-full" />
                <CardHeader className="text-center pt-10 pb-6 px-10">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-200">
                            <Sparkles className="h-10 w-10 text-white animate-pulse" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight text-gray-900">
                        Welcome to Somali<span className="text-purple-600">Services</span>!
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-gray-500 mt-2">
                        {isProvider
                            ? "Your journey as a top service professional in Somalia starts here."
                            : "Easily find and hire the best local professionals for your needs."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-10 pb-10 space-y-8">
                    <div className="grid gap-4">
                        <p className="text-xs font-black uppercase tracking-widest text-purple-600 text-center">Next Steps</p>

                        <div className="space-y-4">
                            {[
                                {
                                    icon: isProvider ? User : ShoppingBag,
                                    title: isProvider ? "Complete Your Profile" : "Describe Your Need",
                                    desc: isProvider ? "Tell clients about your expertise and location." : "Create your first request to get responses from pros."
                                },
                                {
                                    icon: isProvider ? Briefcase : CheckCircle2,
                                    title: isProvider ? "View Available Jobs" : "Compare & Hire",
                                    desc: isProvider ? "Browse the live market for new leads daily." : "Review provider profiles, ratings, and past work."
                                }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-100 transition-all group">
                                    <div className="h-12 w-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="px-10 pb-10">
                    <Button
                        onClick={handleGetStarted}
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black rounded-xl shadow-lg shadow-purple-200 group relative overflow-hidden"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Get Started
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

