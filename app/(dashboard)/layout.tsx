"use client";

import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] relative overflow-hidden bg-white">
            {/* Vibrant White Theme Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Purple Blob */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px] animate-blob" />
                {/* Blue Blob */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px] animate-blob duration-7000 animation-delay-4000" />
                {/* Pink/Indigo Blob */}
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-pink-400/5 rounded-full blur-[100px] animate-blob duration-10000 animation-delay-2000" />

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <DashboardSidebar />

            <div className="flex flex-col min-h-screen relative z-10">
                {/* White Glass Mobile Header */}
                <header className="flex h-16 items-center gap-4 border-b border-gray-100 bg-white/70 backdrop-blur-2xl px-6 md:hidden sticky top-0 z-50">
                    <div className="p-1.5 bg-linear-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg">
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-black text-gray-900 text-lg tracking-tight">
                        Somali<span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Services</span>
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="h-7 w-7 rounded-sm object-cover" />
                            ) : (
                                <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full transition-all duration-500">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-600 ease-out">
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(60px, -80px) scale(1.1); }
                    66% { transform: translate(-40px, 40px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 20s infinite alternate cubic-bezier(0.45, 0.05, 0.55, 0.95);
                }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
}
