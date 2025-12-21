import { Button } from "@/components/ui/button";
import {
    Zap,
    Droplet,
    Wind,
    Sparkles,
    Car,
    Wrench,
    ArrowRight,
    CheckCircle,
    Star,
    Shield,
    ShieldCheck,
    TrendingUp,
    Clock,
    Heart
} from "lucide-react";
import Link from "next/link";

const services = [
    {
        icon: Zap,
        title: "Electrician",
        description: "Complete electrical solutions for your home and office. From simple repairs to complex wiring systems.",
        features: ["Wiring & Rewiring", "Panel Upgrades", "Emergency Repairs"],
        gradient: "from-amber-400 to-orange-600",
        bgLight: "bg-amber-500/5",
        price: "Starts at $25"
    },
    {
        icon: Droplet,
        title: "Plumbing",
        description: "Expert plumbing services specializing in leak detection, pipe replacement, and modern fixture installations.",
        features: ["Leak Detection", "Pipe Repairs", "Fixture Installs"],
        gradient: "from-blue-400 to-indigo-600",
        bgLight: "bg-blue-500/5",
        price: "Starts at $30"
    },
    {
        icon: Wind,
        title: "AC Repair",
        description: "Keep your space cool and comfortable with our comprehensive HVAC maintenance and repair services.",
        features: ["Unit Maintenance", "Gas Refilling", "Duct Cleaning"],
        gradient: "from-rose-400 to-pink-600",
        bgLight: "bg-rose-500/5",
        price: "Starts at $45"
    },
    {
        icon: Sparkles,
        title: "Home Cleaning",
        description: "Professional deep cleaning services tailored to your needs. We ensure every corner of your home sparkles.",
        features: ["Deep Cleaning", "Move-in/Move-out", "Regular Service"],
        gradient: "from-emerald-400 to-teal-700",
        bgLight: "bg-emerald-500/5",
        price: "Starts at $20"
    },
    {
        icon: Car,
        title: "Mechanic",
        description: "Trusted automotive care for all vehicle types. Maintenance, diagnostics, and repairs by certified experts.",
        features: ["Engine Tuning", "Brake Service", "Diagnostics"],
        gradient: "from-slate-600 to-slate-900",
        bgLight: "bg-slate-500/5",
        price: "Starts at $40"
    },
    {
        icon: Wrench,
        title: "General Handyman",
        description: "Versatile home maintenance and assembly services. No job is too small for our skilled handyman team.",
        features: ["Furniture Assembly", "Painting", "Mounting"],
        gradient: "from-violet-500 to-purple-700",
        bgLight: "bg-violet-500/5",
        price: "Starts at $15"
    },
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative pt-12 pb-12 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-blue-50/30 to-background -z-10" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl" />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary border border-primary/20 backdrop-blur-sm shadow-xl">
                            <Zap className="h-4 w-4" />
                            <span>6 Professional Services Available</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Expert Solutions for <br />
                            <span className="bg-linear-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent italic">Every Need.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Join over 5,000 satisfied families who trust our verified professionals
                            for high-quality, guaranteed workmanship.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            {/* Services Grid */}
            <section className="pt-8 md:pt-16 pb-12 md:pb-16 relative overflow-hidden">
                {/* Background Text Decor */}
                <div className="absolute top-0 left-0 text-[20vw] font-black text-primary/5 select-none -z-10 tracking-tighter uppercase whitespace-nowrap translate-y-1/4">
                    Expertise
                </div>

                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, i) => (
                            <div key={i} className="group relative">
                                {/* Gradient Border Wrapper */}
                                <div className="absolute -inset-px rounded-[2.6rem] bg-linear-to-br from-border/50 via-primary/5 to-border/50 group-hover:from-primary/50 group-hover:via-blue-500/50 group-hover:to-purple-600/50 transition-all duration-500 -z-10" />

                                {/* Interactive Card */}
                                <div className="h-full flex flex-col p-8 rounded-[2.5rem] bg-background/70 backdrop-blur-2xl transition-all duration-500 group-hover:bg-background/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3">

                                    {/* Icon Box */}
                                    <div className="relative mb-8 w-20 h-20">
                                        <div className={`absolute inset-0 bg-linear-to-br ${service.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <div className={`relative flex items-center justify-center w-full h-full rounded-3xl bg-linear-to-br ${service.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <service.icon className="h-10 w-10" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-bold tracking-tight">
                                                {service.title}
                                            </h3>
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                                                {service.price}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            {service.description}
                                        </p>

                                        {/* Tag/Features list */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {service.features.map((feature, idx) => (
                                                <span key={idx} className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 bg-muted px-2 py-1 rounded border border-border/50">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Bottom */}
                                    <div className="pt-6 border-t border-border/50">
                                        <Link href="/register" className="flex items-center justify-between group/link">
                                            <span className="text-sm font-bold uppercase tracking-widest text-primary">
                                                Book This Service
                                            </span>
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all duration-300">
                                                <ArrowRight className="h-5 w-5" />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Decorative Corner accent */}
                                    <div className={`absolute top-0 right-0 w-16 h-16 bg-linear-to-bl ${service.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity rounded-tr-[2.4rem] rounded-bl-[4rem]`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {/* CTA Section */}
            <section className="pt-8 md:pt-12 pb-24 md:pb-32">
                <div className="container px-4 md:px-6">
                    <div className="relative overflow-hidden rounded-[4rem] border border-primary/20 bg-linear-to-br from-background via-muted/50 to-primary/5 p-12 md:p-20">
                        {/* Background Patterns */}
                        <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '48px 48px'
                        }} />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-500/20">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Support 24/7 Available</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl">
                                Can't Find The <br />
                                <span className="text-primary italic">Perfect Match?</span>
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Our catalog is always growing. Contact our dedicated support team
                                for custom requests or specialized professional help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto pt-6">
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all w-full bg-white text-primary border-0 hover:-translate-y-1 active:scale-95 hover:bg-primary hover:text-white group">
                                        Join Now
                                        <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/how-it-works" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold bg-white border-2 border-primary/20 text-primary shadow-sm hover:shadow-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 w-full hover:-translate-y-1 active:scale-95 group/how">
                                        How it Works
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover/how:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Floating elements for visual interest */}
                        <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 p-8 rounded-3xl bg-background shadow-2xl rotate-12 border border-border/50 animate-bounce transition-all [animation-duration:3s]">
                            <Heart className="h-8 w-8 text-rose-500" />
                        </div>
                        <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 p-8 rounded-3xl bg-background shadow-2xl -rotate-12 border border-border/50 animate-bounce transition-all [animation-duration:4s]">
                            <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
