"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, DollarSign, Settings, User, LogOut, MessageCircle } from "lucide-react";

interface MobileNavProps {
    isClient: boolean;
}

export function MobileNav({ isClient }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const links = isClient
        ? [
            { href: "/client", label: "Aragtida Guud", icon: LayoutDashboard },
            { href: "/client/requests", label: "Codsiyadaada", icon: ShoppingBag },
            { href: "/client/profile", label: "Profile-ka", icon: User },
            { href: "/client/settings", label: "Habaynta", icon: Settings },
        ]
        : [
            { href: "/provider", label: "Dashboard-ka", icon: LayoutDashboard },
            { href: "/provider/jobs", label: "Shaqooyinkaaga", icon: ShoppingBag },
            { href: "/provider/earnings", label: "Dakhliga", icon: DollarSign },
            { href: "/provider/profile", label: "Profile-ka", icon: User },
        ];

    return (
        <div className="md:hidden">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 flex items-center justify-between px-4 z-50">
                <Link href="/" className="font-black text-xl bg-linear-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent tracking-tight">
                    Somali<span className="text-gray-900">Services</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(!open)}
                    className="relative rounded-xl hover:bg-primary/5 transition-colors"
                >
                    {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-gray-600" />}
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-2xl z-40 overflow-y-auto md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-4 space-y-3">
                            {/* Role Badge */}
                            <div className="p-5 bg-linear-to-br from-primary/5 via-white to-blue-50/50 rounded-2xl mb-4 border border-primary/10 shadow-xl shadow-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8" />
                                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1 relative z-10">System Portal</p>
                                <p className="text-xl font-black text-gray-900 tracking-tight relative z-10">
                                    {isClient ? "Macmiil" : "Xirfadle"} <span className="text-primary font-medium opacity-60">HQ</span>
                                </p>
                            </div>

                            {/* Navigation Links */}
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-black transition-all duration-300",
                                            isActive
                                                ? "bg-linear-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                : "text-gray-600 hover:bg-primary/5 hover:text-primary active:scale-98"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "animate-pulse" : "")} />
                                        <span className="tracking-tight">{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Logout */}
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-black text-red-600 bg-red-50/50 border border-red-100/50 transition-all mt-6 active:scale-95 shadow-sm"
                            >
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span className="uppercase tracking-widest text-xs">Ka Bax</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
