"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, DollarSign, Settings, User, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";


interface MobileNavProps {
    isClient: boolean;
}

export function MobileNav({ isClient }: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = pathname.includes("/admin");
    const isActuallyAdmin = session?.user?.role === "ADMIN";

    const links = isAdmin
        ? [
            { href: "/admin", label: "Analytics", icon: LayoutDashboard },
            { href: "/admin/users", label: "Isticmaalayaasha", icon: User },
            { href: "/admin/providers", label: "Xaqiijinta", icon: ShieldCheck },
            { href: "/admin/reports", label: "Warbixinada", icon: ShoppingBag },
        ]
        : isClient
            ? [
                { href: "/client", label: "Aragtida Guud", icon: LayoutDashboard },
                { href: "/client/requests", label: "Codsiyadaada", icon: ShoppingBag },
                ...(isActuallyAdmin ? [{ href: "/admin", label: "Admin Panel", icon: ShieldCheck }] : []),
                { href: "/client/profile", label: "Profile-ka", icon: User },
                { href: "/client/settings", label: "Habaynta", icon: Settings },
            ]
            : [
                { href: "/provider", label: "Dashboard-ka", icon: LayoutDashboard },
                { href: "/provider/jobs", label: "Shaqooyinkaaga", icon: ShoppingBag },
                ...(isActuallyAdmin ? [{ href: "/admin", label: "Admin Panel", icon: ShieldCheck }] : []),
                { href: "/provider/earnings", label: "Dakhliga", icon: DollarSign },
                { href: "/provider/profile", label: "Profile-ka", icon: User },
            ];

    return (
        <div className="md:hidden">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 z-50">
                <Link href="/" className="font-black text-xl bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent tracking-tight">
                    Somali<span className="text-foreground">Services</span>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(!open)}
                        className="relative rounded-xl hover:bg-primary/5 transition-colors"
                    >
                        {open ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-muted-foreground" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-background/95 dark:bg-card/95 backdrop-blur-2xl z-40 overflow-y-auto md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-4 space-y-3">
                            {/* Role Badge */}
                            <div className="p-5 bg-gradient-to-br from-primary/5 via-background to-blue-50/50 dark:to-blue-900/10 rounded-2xl mb-4 border border-border shadow-xl shadow-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8" />
                                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1 relative z-10">System Portal</p>
                                <p className="text-xl font-black text-foreground tracking-tight relative z-10">
                                    {isActuallyAdmin ? "Maamule" : isClient ? "Macmiil" : "Xirfadle"} <span className="text-primary font-medium opacity-60">HQ</span>
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
                                                ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary active:scale-98"
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
                                className="flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-black text-red-600 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 transition-all mt-6 active:scale-95 shadow-sm"
                            >
                                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
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

