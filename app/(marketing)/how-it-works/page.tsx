import { Button } from "@/components/ui/button";
import {
    Search,
    Users,
    Star,
    Shield,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Zap,
    Clock,
    ShieldCheck,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-blue-50/50 to-background -z-10" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary border border-primary/20 backdrop-blur-sm transition-all hover:bg-primary/15 cursor-default">
                            <Sparkles className="h-4 w-4" />
                            <span>Transparent & Reliable Process</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Experience Seamless <br />
                            <span className="bg-linear-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">Service Delivery</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            We've simplified the way you find and book professionals.
                            From emergency repairs to scheduled maintenance, we've got you covered.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="pt-24 pb-12 md:pb-16 relative overflow-hidden">
                {/* Background Text Decor */}
                <div className="absolute top-0 right-0 text-[15vw] font-black text-primary/5 select-none -z-10 tracking-tighter uppercase whitespace-nowrap -rotate-6 translate-y-1/4">
                    The Steps
                </div>

                <div className="container px-4 md:px-6">
                    <div className="grid gap-24 md:gap-32">
                        {/* Step 1 */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center group">
                            <div className="space-y-8 relative">
                                <div className="flex items-center gap-6">
                                    <div className="relative flex items-center justify-center w-20 h-20">
                                        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:bg-primary/30 transition-all" />
                                        <div className="relative flex items-center justify-center w-full h-full rounded-3xl bg-linear-to-br from-primary to-blue-600 text-white font-black text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            01
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Post Your Request</h2>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Simply describe what you need. Whether it's a leaky faucet or a complete house wiring,
                                        include as many details as possible for better service matching.
                                    </p>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                        {[
                                            { icon: CheckCircle, text: "Attach photos" },
                                            { icon: CheckCircle, text: "Set your location" },
                                            { icon: CheckCircle, text: "Define your budget" },
                                            { icon: CheckCircle, text: "Pick your timeline" }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/20 hover:bg-background transition-all group/li">
                                                <item.icon className="h-5 w-5 text-primary group-hover/li:scale-110 transition-transform" />
                                                <span className="font-medium">{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="relative h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden group/img">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-blue-600/10 -z-10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-64 h-64">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                                        <div className="relative flex items-center justify-center w-full h-full rounded-[3rem] bg-white shadow-2xl group-hover/img:scale-110 group-hover/img:-rotate-3 transition-all duration-700">
                                            <Search className="h-32 w-32 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative Floating Dots */}
                                <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-primary/20 animate-bounce" />
                                <div className="absolute bottom-20 left-10 w-6 h-6 rounded-full bg-blue-400/20 animate-bounce delay-300" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center group">
                            <div className="order-2 lg:order-1 relative h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden group/img">
                                <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-pink-500/10 -z-10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-64 h-64">
                                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                                        <div className="relative flex items-center justify-center w-full h-full rounded-[3rem] bg-white shadow-2xl group-hover/img:scale-110 group-hover/img:rotate-3 transition-all duration-700">
                                            <Users className="h-32 w-32 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative flex items-center justify-center w-20 h-20">
                                        <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:bg-purple-500/30 transition-all" />
                                        <div className="relative flex items-center justify-center w-full h-full rounded-3xl bg-linear-to-br from-purple-500 to-pink-600 text-white font-black text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            02
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get Matched</h2>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Our platform connects you with the best-rated professionals in your immediate area.
                                        They'll review your request and accept it based on their expertise and availability.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: ShieldCheck, title: "Verified Pros", desc: "Background checked" },
                                            { icon: Star, title: "Top Rated", desc: "Highest quality" },
                                            { icon: Clock, title: "Fast Matches", desc: "Under 5 mins" },
                                            { icon: Zap, title: "Instant Booking", desc: "One-click hire" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-background transition-colors group/item">
                                                <div className="flex-none flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 group-hover/item:scale-110 transition-transform">
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{item.title}</div>
                                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center group">
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative flex items-center justify-center w-20 h-20">
                                        <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl group-hover:bg-emerald-500/30 transition-all" />
                                        <div className="relative flex items-center justify-center w-full h-full rounded-3xl bg-linear-to-br from-emerald-400 to-teal-600 text-white font-black text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            03
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Job Done & Pay</h2>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Once the work is completed to your satisfaction, simply release the payment.
                                        Don't forget to rate your experience to help others!
                                    </p>
                                    <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-500/5 to-teal-500/5 border-2 border-emerald-500/10 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div className="font-bold">100% Satisfaction Guarantee</div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            If you're not happy with the service, our support team is available 24/7 to help resolve any issues.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden group/img">
                                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-teal-500/10 -z-10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-64 h-64">
                                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                                        <div className="relative flex items-center justify-center w-full h-full rounded-[3rem] bg-white shadow-2xl group-hover/img:scale-110 group-hover/img:-rotate-3 transition-all duration-700">
                                            <Star className="h-32 w-32 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pt-12 md:pt-16 pb-24 md:pb-32">
                <div className="container px-4 md:px-6">
                    <div className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-primary via-blue-700 to-indigo-900 text-white p-12 md:p-20 shadow-2xl">
                        {/* Background Orbs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
                            <h2 className="text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                                Join thousands of Somali families who have simplified their home maintenance
                                with our trusted professionals.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-5 pt-4 w-full sm:w-auto">
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all w-full bg-white text-primary border-0 hover:-translate-y-1 active:scale-95 hover:bg-primary hover:text-white group">
                                        Create Account
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/services" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold bg-white/20 border-2 border-white/40 backdrop-blur-md hover:bg-white/30 transition-all w-full text-white hover:-translate-y-1 active:scale-95">
                                        Browse Services
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
