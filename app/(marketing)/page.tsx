import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Zap, CheckCircle, Star, Shield, Sparkles, Users, TrendingUp } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-white to-blue-50/30 -z-10" />

                {/* Refined Floating Element - Right Side */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl opacity-60" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
                        {/* Premium Badge */}
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-bold text-primary shadow-lg shadow-primary/5 border border-primary/10 transition-transform hover:scale-105">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span>Waxaa Na'aaminay In kabadan 5,000+ Qoysas Somaliyeed</span>
                            </div>
                        </div>

                        {/* Main Heading - Reduced Size & Refined */}
                        <h1 className="text-3xl font-black tracking-tight sm:text-3xl md:text-5xl text-slate-900 leading-[1.15]">
                            <span className="block mb-2 text-slate-800">Adeegyo xirfadaysan oo</span>
                            <span className="bg-linear-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent pb-2">
                                laguugu keenayo albaabkaaga
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed font-medium">
                            Hel korontayste, tuubayste iyo farsamayaqaanno lagu kalsoon yahay.
                            Dalbo isla markiiba, kuna bixi si ammaan ah.
                        </p>

                        {/* CTA Buttons - Premium Styling */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    Book a Service
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto h-14 px-8 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Find Providers
                                </Button>
                            </Link>
                        </div>

                        {/* Stats - Horizontal & Sleek */}
                        {/* Stats - Premium Glass Design */}
                        <div className="w-full max-w-5xl mx-auto mt-12 md:mt-20">
                            {/* Unified Glass Container */}
                            <div className="relative rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl shadow-blue-900/5 p-2 md:p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">

                                    {/* Stat 1 */}
                                    <div className="group relative p-6 md:px-8 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/50 rounded-2xl">
                                        <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <Users className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">500+</div>
                                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Xirfadlayaal</div>
                                        </div>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="group relative p-6 md:px-8 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/50 rounded-2xl">
                                        <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                            <CheckCircle className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">10K+</div>
                                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Shaqooyin</div>
                                        </div>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="group relative p-6 md:px-8 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/50 rounded-2xl">
                                        <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 shadow-sm group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                                            <Star className="h-7 w-7 fill-current" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-amber-500 transition-colors">4.9/5</div>
                                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Qiimaynta</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Wave - Seamless Transition */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
            </section>

            {/* Services Grid */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="container px-4 md:px-6 relative">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-sm">
                            <Zap className="h-3.5 w-3.5" />
                            <span>Hadda La Heli Karo</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                            Adeegyada <span className="text-primary italic">Ugu Caansan</span>
                        </h2>
                        <p className="max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                            Wax kasta oo aad u baahan tahay si gurigaaga ama xafiiskaaga loo dayactiro.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Zap,
                                label: "Korantayste",
                                description: "Khabiir ku ah fiilooyinka & dayactirka.",
                                gradient: "from-amber-400 to-orange-500",
                                shadowColor: "shadow-orange-500/20",
                                bgLight: "bg-amber-500/5",
                                borderColor: "border-amber-500/20"
                            },
                            {
                                icon: CheckCircle,
                                label: "Tuubayste",
                                description: "Hagaajinta dillaacyada & tuubooyinka.",
                                gradient: "from-blue-400 to-indigo-600",
                                shadowColor: "shadow-blue-500/20",
                                bgLight: "bg-blue-500/5",
                                borderColor: "border-blue-500/20"
                            },
                            {
                                icon: Star,
                                label: "Nadiifiye",
                                description: "Nadaafad dhamaystiran oo guryaha ah.",
                                gradient: "from-emerald-400 to-teal-600",
                                shadowColor: "shadow-emerald-500/20",
                                bgLight: "bg-emerald-500/5",
                                borderColor: "border-emerald-500/20"
                            },
                            {
                                icon: Shield,
                                label: "Qaboojiye (AC)",
                                description: "Dayactir iyo adeeg qaboojiyaasha.",
                                gradient: "from-rose-400 to-pink-600",
                                shadowColor: "shadow-rose-500/20",
                                bgLight: "bg-rose-500/5",
                                borderColor: "border-rose-500/20"
                            },
                        ].map((service, i) => (
                            <Link key={i} href="/register" className="group relative block h-full">
                                <div className={`relative h-full overflow-hidden rounded-3xl border ${service.borderColor} bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group-hover:border-primary/50`}>
                                    <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br ${service.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

                                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${service.gradient} text-white shadow-lg shadow-black/5`}>
                                        <service.icon className="h-6 w-6" />
                                    </div>

                                    <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {service.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/services">
                            <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:bg-primary/5 text-primary font-semibold hover:border-primary/50 transition-all">
                                Eeg Dhamaan Adeegyada
                                <ArrowRight className="ml-2 h-4 w-4" />
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
                            <span>Fudud oo Degdeg ah</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl">
                            Sidee ayaan <span className="text-blue-600 italic">Ushaqaynaa</span>
                        </h2>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            Markii hore ma fududayn inay is helaan macmiil iyo xirafadlihii ku habonaa inuu shaqadaas qabto ,
                            Barnaamij kaan wuxuu kuu sahalaya adigoo raacaya qorshaha aan u dajinay inaad heshid xirfadle kugu haboon ama macmiil.
                        </p>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-3 xl:gap-16 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />

                        {[
                            {
                                number: "01",
                                title: "Soo dir codsi shaqo ",
                                description: "Sharax waxa aad rabto in laguu qabto, sawirro ku dar, goobata aad ku noo shahay. Waxay qaadaneysaa wax ka yar 2 daqiiqo.",
                                icon: Search,
                                gradient: "from-blue-500 to-indigo-600",
                                shadow: "shadow-blue-500/20"
                            },
                            {
                                number: "02",
                                title: "Hell xirfadle kugu haboon",
                                description: "Adeeg-bixiyeyaasha deegaankaaga ayaa arki doona codsigaaga. Waxaa lagu ogeysiinayaa marka uu mid aqbalo.",
                                icon: Users,
                                gradient: "from-purple-500 to-pink-600",
                                shadow: "shadow-purple-500/20"
                            },
                            {
                                number: "03",
                                title: "Job Done",
                                description: "Adeeg-bixiyuhu wuu kuu imaan doonaa ,shqadana kuu qabanyaa , and you pay securely through the platform. Success!",
                                icon: Sparkles,
                                gradient: "from-emerald-400 to-teal-600",
                                shadow: "shadow-emerald-500/20"
                            }
                        ].map((step, i) => (
                            <div key={i} className="group relative">
                                {/* Step Card */}
                                <div className="h-full flex flex-col p-12 lg:p-14 rounded-[3rem] border border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-4">
                                    {/* Large Floating Number */}
                                    <div className="absolute -top-8 -right-8 text-8xl lg:text-9xl font-black text-primary/10 group-hover:text-primary/20 transition-colors italic">
                                        {step.number}
                                    </div>

                                    {/* Icon Box */}
                                    <div className={`relative mb-10 w-24 h-24`}>
                                        <div className={`absolute inset-0 bg-linear-to-br ${step.gradient} rounded-4xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <div className={`relative flex items-center justify-center w-full h-full rounded-4xl bg-linear-to-br ${step.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <step.icon className="h-12 w-12" />
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-bold tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Bottom Indicator */}
                                    <div className="mt-auto pt-10 flex items-center gap-4">
                                        <div className={`h-2 w-16 rounded-full bg-linear-to-r ${step.gradient} opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:w-24`} />
                                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse" />
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
                                    <h4 className="text-2xl font-bold tracking-tight">Amnigaagu waa mudnaan tayada 1 aad.</h4>
                                    <p className="text-muted-foreground max-w-md">
                                        Adeeg-bixiye kasta oo ku jira mada sheena wuxuu maraa baaritaan iyo hubin dhammeystiran.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-sm">Aqoonsiyo La Hubiyay</span>
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
