"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, DollarSign, Settings, User, LogOut, Sparkles, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { NotificationCenter } from "./notification-center";


export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isClient = pathname.includes("/client");

    const links = isClient
        ? [
            { href: "/client", label: "Overview", icon: LayoutDashboard },
            { href: "/client/requests", label: "My Requests", icon: ShoppingBag },
            { href: "/client/profile", label: "Profile", icon: User },
            { href: "/client/settings", label: "Settings", icon: Settings },
        ]
        : [
            { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
            { href: "/provider/jobs", label: "My Jobs", icon: ShoppingBag },
            { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
            { href: "/provider/profile", label: "Profile", icon: User },
        ];

    return (
        <div className="hidden md:flex w-70 flex-col h-screen bg-white border-r border-gray-100 sticky top-0 left-0 z-40">
            {/* Header with Brand Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-50/50">
                <Link href="/" className="flex items-center gap-2.5 font-bold transition-opacity hover:opacity-80 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-primary to-blue-600 transition-transform group-hover:scale-110">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight bg-linear-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                            Somali
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest -mt-1">
                            Services
                        </span>
                    </div>
                </Link>
            </div>

            {/* Role Badge - Beautified */}
            <div className="px-4 py-4">
                <div className="relative group overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border border-primary/10 bg-linear-to-br from-primary/3 to-white">
                    {/* Animated background element */}
                    <div className="absolute top-0 right-0 -tranislate-y-1/2 translate-x-1/2 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-white p-0.5 shadow-sm ring-1 ring-primary/10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="h-full w-full object-cover rounded-[10px]" />
                                ) : (
                                    <div className="h-full w-full bg-linear-to-br from-primary/5 to-primary/20 flex items-center justify-center rounded-[10px]">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                            </div>
                            {/* Online/Active status indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 leading-none mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Portal</span>
                                <div className="h-1 w-1 rounded-full bg-primary/20" />
                                <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded-full uppercase tracking-tighter">Live</span>
                            </div>
                            <span className="text-[15px] font-bold text-gray-900 tracking-tight leading-none">
                                {isClient ? "Client" : "Provider"} <span className="text-gray-400 font-medium">Space</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Links - Simple & Professional */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                                    : "text-gray-500 hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            <Icon className={cn(
                                "h-4 w-4 shrink-0 transition-transform duration-200",
                                isActive ? "scale-105" : "group-hover:scale-110"
                            )} />
                            <span>{link.label}</span>

                            {isActive && (
                                <div className="ml-auto w-1 h-3 bg-white/30 rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Section - Beautified Logout */}
            <div className="p-4 border-t border-gray-50">
                <div className="space-y-2">
                    <NotificationCenter />
                    <Link href="/login" className="block w-full">
                        <Button
                            variant="ghost"
                            className="w-full justify-between rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300 h-12 px-4 group border border-gray-100 hover:border-transparent shadow-sm hover:shadow-lg hover:shadow-red-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gray-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <LogOut className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold">Log Out</span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
