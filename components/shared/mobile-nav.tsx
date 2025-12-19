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
        <div className="md:hidden">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
                <Link href="/" className="font-bold text-lg bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Somali Services
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(!open)}
                    className="relative"
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 overflow-y-auto md:hidden">
                        <div className="p-4 space-y-2">
                            {/* Role Badge */}
                            <div className="p-4 bg-linear-to-br from-purple-50 to-blue-50 rounded-xl mb-4 border border-purple-100">
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Portal</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {isClient ? "Client" : "Provider"} <span className="text-gray-400 font-medium">Space</span>
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
                                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary text-white shadow-sm"
                                                : "text-gray-600 hover:bg-purple-50 hover:text-primary"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Logout */}
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-4"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
