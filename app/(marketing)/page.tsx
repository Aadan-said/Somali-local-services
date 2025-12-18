import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Zap, CheckCircle, Star, Shield, Sparkles, Users, TrendingUp } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-blue-50 to-background -z-10" />

                {/* Floating Orbs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl" />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center space-y-6 text-center max-w-5xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
                            <Sparkles className="h-4 w-4" />
                            <span>Trusted by 5,000+ Somali families</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            <span className="block mb-1">Professional Services</span>
                            <span className="bg-linear-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Delivered to Your Door
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mx-auto max-w-[700px] text-base md:text-lg text-muted-foreground leading-relaxed">
                            Find trusted electricians, plumbers, and technicians in your area.
                            Book instantly and pay securely with verified professionals.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-base h-12 px-6 shadow-lg hover:shadow-xl transition-all group"
                                >
                                    Book a Service
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto text-base h-12 px-6 border-2 hover:bg-muted/50 group"
                                >
                                    <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                    Find Providers
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 w-full max-w-3xl">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative flex flex-col items-center p-6 space-y-2 rounded-2xl border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:border-primary/40 transition-all hover:shadow-lg">
                                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-primary to-blue-600 text-white shadow-lg">
                                        <Users className="h-7 w-7" />
                                    </div>
                                    <div className="text-3xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">500+</div>
                                    <div className="text-sm font-medium text-muted-foreground">Verified Pros</div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-linear-to-br from-green-500/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative flex flex-col items-center p-6 space-y-2 rounded-2xl border-2 border-green-500/20 bg-background/80 backdrop-blur-sm hover:border-green-500/40 transition-all hover:shadow-lg">
                                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                                        <CheckCircle className="h-7 w-7" />
                                    </div>
                                    <div className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">10K+</div>
                                    <div className="text-sm font-medium text-muted-foreground">Jobs Done</div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-linear-to-br from-yellow-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative flex flex-col items-center p-6 space-y-2 rounded-2xl border-2 border-yellow-500/20 bg-background/80 backdrop-blur-sm hover:border-yellow-500/40 transition-all hover:shadow-lg">
                                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                                        <Star className="h-7 w-7" />
                                    </div>
                                    <div className="text-3xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">4.9/5</div>
                                    <div className="text-sm font-medium text-muted-foreground">Avg Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-muted/30 to-transparent" />
            </section>

            {/* Services Grid */}
            <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl -z-10" />

                <div className="container px-4 md:px-6 relative">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-sm">
                            <Zap className="h-3.5 w-3.5" />
                            <span>Available Now</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                            Popular <span className="text-primary italic">Services</span>
                        </h2>
                        <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                            Everything you need for your home and office maintenance,
                            delivered by certified professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {[
                            {
                                icon: Zap,
                                label: "Electrician",
                                description: "Expert wiring, repairs and installations.",
                                gradient: "from-amber-400 to-orange-500",
                                shadowColor: "shadow-orange-500/20",
                                bgLight: "bg-amber-500/5"
                            },
                            {
                                icon: CheckCircle,
                                label: "Plumber",
                                description: "Fix leaks, pipes and bathroom fittings.",
                                gradient: "from-blue-400 to-indigo-600",
                                shadowColor: "shadow-blue-500/20",
                                bgLight: "bg-blue-500/5"
                            },
                            {
                                icon: Star,
                                label: "Cleaning",
                                description: "Deep cleaning for homes and offices.",
                                gradient: "from-emerald-400 to-teal-600",
                                shadowColor: "shadow-emerald-500/20",
                                bgLight: "bg-emerald-500/5"
                            },
                            {
                                icon: Shield,
                                label: "AC Repair",
                                description: "Maintenance & service for all AC units.",
                                gradient: "from-rose-400 to-pink-600",
                                shadowColor: "shadow-rose-500/20",
                                bgLight: "bg-rose-500/5"
                            },
                        ].map((service, i) => (
                            <Link key={i} href="/register" className="group relative block">
                                {/* Gradient Border Wrapper */}
                                <div className="absolute -inset-px rounded-[2.1rem] bg-linear-to-br from-border/50 via-primary/5 to-border/50 group-hover:from-primary/50 group-hover:to-blue-600/50 transition-all duration-500 -z-10" />

                                <div className="relative h-full flex flex-col p-8 rounded-4xl bg-background/70 backdrop-blur-2xl transition-all duration-500 group-hover:bg-background/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 flex-1">
                                    {/* Icon Layered Effect */}
                                    <div className="relative mb-8 w-16 h-16">
                                        <div className={`absolute inset-0 bg-linear-to-br ${service.gradient} rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                                        <div className={`relative flex items-center justify-center w-full h-full rounded-2xl bg-linear-to-br ${service.gradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <service.icon className="h-8 w-8" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3 mb-6 flex-1">
                                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                            {service.label}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Action Bottom */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                                            Book Now
                                        </span>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>

                                    {/* Animated Corner accent */}
                                    <div className={`absolute top-0 right-0 w-12 h-12 bg-linear-to-bl ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-tr-[1.4rem] rounded-bl-3xl`} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="mt-12 flex justify-center">
                        <Link href="/services">
                            <Button variant="outline" size="lg" className="h-14 px-10 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 group">
                                <span className="mr-2 font-semibold">Explore All Services</span>
                                <TrendingUp className="h-4 w-4 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="relative pt-12 md:pt-16 pb-24 md:pb-32 bg-background overflow-hidden">
                {/* Background Text Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-primary/5 select-none -z-10 tracking-tighter uppercase whitespace-nowrap">
                    Process
                </div>

                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center text-center mb-20 space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 border border-blue-500/20 backdrop-blur-sm">
                            <ArrowRight className="h-3.5 w-3.5" />
                            <span>Simple & Fast</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            How It <span className="text-blue-600 italic">Works</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
                            Getting things done has never been easier. Three simple steps
                            from posting a request to a completed job.
                        </p>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-3 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />

                        {[
                            {
                                number: "01",
                                title: "Post a Request",
                                description: "Describe what you need done, upload photos, and set your location. It takes less than 2 minutes.",
                                icon: Search,
                                gradient: "from-blue-500 to-indigo-600",
                                shadow: "shadow-blue-500/20"
                            },
                            {
                                number: "02",
                                title: "Get Matched",
                                description: "Verified providers in your area will view your request. You'll get notified as soon as someone accepts.",
                                icon: Users,
                                gradient: "from-purple-500 to-pink-600",
                                shadow: "shadow-purple-500/20"
                            },
                            {
                                number: "03",
                                title: "Job Done",
                                description: "The provider arrives, completes the work, and you pay securely through the platform. Success!",
                                icon: Sparkles,
                                gradient: "from-emerald-400 to-teal-600",
                                shadow: "shadow-emerald-500/20"
                            }
                        ].map((step, i) => (
                            <div key={i} className="group relative">
                                {/* Step Card */}
                                <div className="h-full flex flex-col p-10 rounded-[2.5rem] border border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-3">
                                    {/* Large Floating Number */}
                                    <div className="absolute -top-6 -right-6 text-7xl font-black text-primary/10 group-hover:text-primary/20 transition-colors italic">
                                        {step.number}
                                    </div>

                                    {/* Icon Box */}
                                    <div className={`relative mb-8 w-20 h-20`}>
                                        <div className={`absolute inset-0 bg-linear-to-br ${step.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <div className={`relative flex items-center justify-center w-full h-full rounded-3xl bg-linear-to-br ${step.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <step.icon className="h-10 w-10" />
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Bottom Indicator */}
                                    <div className="mt-auto pt-8 flex items-center gap-3">
                                        <div className={`h-1.5 w-12 rounded-full bg-linear-to-r ${step.gradient} opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:w-20`} />
                                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Banner */}
                    <div className="mt-24 p-1 rounded-[3rem] bg-linear-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10">
                        <div className="bg-background/80 backdrop-blur-3xl rounded-[2.9rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20">
                            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary">
                                    <Shield className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold tracking-tight">Safety First, Always.</h4>
                                    <p className="text-muted-foreground max-w-md">
                                        Every provider on our platform undergoes a rigorous background check and verification process.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-sm">Verified IDs</span>
                                </div>
                                <div className="px-6 py-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                                    <Star className="h-5 w-5 text-blue-500" />
                                    <span className="font-semibold text-sm">Top Rated Only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
