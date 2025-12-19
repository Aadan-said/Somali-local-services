import Link from "next/link";
import {
    Sparkles,
    Twitter,
    Facebook,
    Instagram,
    Mail,
    ExternalLink,
    ArrowUpRight,
    ShieldCheck,
    Globe,
    Search,
    Users,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="relative border-t border-border/50 bg-linear-to-b from-background to-muted/30 overflow-hidden">
            {/* Top Glow Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container px-4 md:px-6 pt-20 pb-12">
                {/* Main Grid */}
                <div className="grid gap-12 lg:grid-cols-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-primary via-blue-600 to-indigo-600 shadow-xl group-hover:scale-110 transition-transform">
                                <Sparkles className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter bg-linear-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                                SomaliServices
                            </span>
                        </Link>

                        <p className="text-muted-foreground leading-relaxed max-w-sm">
                            The largest and most trusted platform for professional local services in Somalia.
                            Connecting quality pros with families who value excellence.
                        </p>

                        <div className="flex items-center gap-4">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Facebook, href: "#" },
                                { icon: Instagram, href: "#" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-background border border-border/50 shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300"
                                >
                                    <social.icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>

                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {/* Platform */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Search className="h-4 w-4 text-primary" />
                                Platform
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { label: "Marketplace", href: "/services" },
                                    { label: "Popular Services", href: "/services" },
                                    { label: "Become a Pro", href: "/register" },
                                    { label: "Safety First", href: "/how-it-works" }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group/link">
                                            {link.label}
                                            <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover/link:opacity-100 -translate-y-1 translate-x-1 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                Company
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { label: "Our Story", href: "/about" },
                                    { label: "Careers", href: "/careers" },
                                    { label: "Local Impact", href: "/about" },
                                    { label: "Newsroom", href: "/about" }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group/link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Heart className="h-4 w-4 text-primary" />
                                Support
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { label: "Help Center", href: "/help" },
                                    { label: "FAQ", href: "/faq" },
                                    { label: "Community", href: "/about" },
                                    { label: "Contact Us", href: "/contact" }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group/link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Legal
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { label: "Privacy Policy", href: "/privacy" },
                                    { label: "Terms of Use", href: "/terms" },
                                    { label: "Secure Payments", href: "/privacy" },
                                    { label: "Cookie Policy", href: "/cookies" }
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group/link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter Sub-Footer */}
                <div className="relative mb-20 p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-primary/10 -rotate-12">
                        <Mail className="h-32 w-32" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="space-y-2 text-center lg:text-left">
                            <h3 className="text-2xl font-bold tracking-tight">Stay ahead with SomaliServices</h3>
                            <p className="text-muted-foreground max-w-md">
                                Get monthly tips on home maintenance and exclusive provider discounts.
                            </p>
                        </div>
                        <div className="flex w-full max-w-md gap-3">
                            <Input
                                type="email"
                                placeholder="Email address"
                                className="h-14 rounded-2xl bg-background border-border/50 focus:ring-primary/20"
                            />
                            <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl">
                                Join
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border/50 gap-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>Somalia (SO)</span>
                        <span className="mx-2">•</span>
                        <span>English (EN)</span>
                    </div>

                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © 2025 Somali Local Services. Madal lagu dhisay tayo iyo xirfad.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <span className="text-muted-foreground">Lead by</span>
                            <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent font-bold">Aadan Said</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Very Bottom Accent */}
            <div className="h-1 bg-linear-to-r from-primary via-blue-600 to-indigo-600 w-full" />
        </footer>
    );
}
