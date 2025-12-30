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
            { href: "/client", label: "Aragtida Guud", icon: LayoutDashboard },
            { href: "/client/requests", label: "Codsiyadayda", icon: ShoppingBag },
            { href: "/client/wallet", label: "Jeebka (Wallet)", icon: DollarSign },
            { href: "/client/profile", label: "Profile-ka", icon: User },
            { href: "/client/settings", label: "Habaynta", icon: Settings },
        ]
        : [
            { href: "/provider", label: "Dashboard-ka", icon: LayoutDashboard },
            { href: "/provider/jobs", label: "Shaqooyinkaga", icon: ShoppingBag },
            { href: "/provider/earnings", label: "Dakhliga", icon: DollarSign },
            { href: "/provider/profile", label: "Profile-ka", icon: User },
        ];

    return (
        <div className="hidden md:flex w-72 flex-col h-screen bg-white/60 backdrop-blur-xl border-r border-gray-100/50 sticky top-0 left-0 z-40 shadow-xl shadow-gray-500/5">
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
                <div className="relative group overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border border-white bg-white/40 backdrop-blur-md shadow-lg shadow-gray-500/5 ring-1 ring-gray-100/50">
                    {/* Animated background element */}
                    <div className="absolute top-0 right-0 -tranislate-y-1/2 translate-x-1/2 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-white p-0.5 shadow-md ring-1 ring-primary/10 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="h-full w-full object-cover rounded-[10px]" />
                                ) : (
                                    <div className="h-full w-full bg-linear-to-br from-primary/5 to-primary/20 flex items-center justify-center rounded-[10px]">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                            </div>
                            {/* Online/Active status indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 leading-none mb-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Portal</span>
                                <div className="h-1 w-1 rounded-full bg-primary/20" />
                                <span className="text-[8px] font-black text-white px-2 py-0.5 bg-primary rounded-full uppercase tracking-tighter shadow-sm">Active</span>
                            </div>
                            <span className="text-[14px] font-black text-gray-900 tracking-tight leading-none">
                                {isClient ? "Macmiil" : "Xirfadle"} <span className="text-primary font-medium opacity-60">HQ</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Links - Simple & Professional */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                                isActive
                                    ? "bg-linear-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25 scale-[1.02]"
                                    : "text-gray-500 hover:bg-white hover:text-primary hover:shadow-md hover:shadow-gray-200/50 ring-1 ring-transparent hover:ring-gray-100"
                            )}
                        >
                            <Icon className={cn(
                                "h-4 w-4 shrink-0 transition-all duration-300",
                                isActive ? "scale-110 rotate-3" : "group-hover:scale-110 group-hover:-rotate-3"
                            )} />
                            <span className="tracking-tight">{link.label}</span>

                            {isActive && (
                                <div className="ml-auto flex items-center gap-1">
                                    <div className="w-1 h-3 bg-white/40 rounded-full" />
                                    <div className="w-1 h-1.5 bg-white/20 rounded-full" />
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Section - Beautified Logout */}
            <div className="p-4 border-t border-gray-100/50">
                <div className="space-y-3">
                    <NotificationCenter />
                    <Link href="/login" className="block w-full">
                        <Button
                            variant="ghost"
                            className="w-full justify-between rounded-2xl text-gray-500 hover:text-white hover:bg-linear-to-r hover:from-red-500 hover:via-orange-500 hover:to-pink-500 transition-all duration-500 h-14 px-5 group border border-gray-100 hover:border-transparent shadow-sm hover:shadow-2xl hover:shadow-red-500/20 active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-gray-50 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                                    <LogOut className="h-4 w-4" />
                                </div>
                                <span className="text-[13px] font-black uppercase tracking-widest">Ka Bax</span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
