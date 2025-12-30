"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/services", label: "Adeegyada" },
        { href: "/jobs", label: "Shaqooyinka" },
        { href: "/how-it-works", label: "Sidee U shaqaynaa" },
        { href: "/providers", label: "Xirfadlayaasha" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-primary to-blue-600 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-linear-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                        SomaliServices
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-medium">
                            Geli Akoon hore
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button
                            size="sm"
                            className="bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 font-medium shadow-md hover:shadow-lg transition-all group"
                        >
                            Abuur Akoon cusub
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-primary/10 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
                    <nav className="container px-4 py-4 space-y-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium rounded-lg transition-all",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {/* Mobile Auth Buttons */}
                        <div className="pt-4 space-y-2 border-t border-border/40">
                            <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center">
                                    Geli Akoon hore
                                </Button>
                            </Link>
                            <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full justify-center bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md group">
                                    Abuur Akoon cusub
                                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
