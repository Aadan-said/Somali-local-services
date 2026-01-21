import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    Calendar,
    TrendingUp,
    Shield,
    Users,
    Zap,
    CheckCircle,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Clock,
    Heart,
    BarChart3,
    Target,
    LucideIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Benefit {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
}

interface Step {
    number: string;
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
}

export default function ProvidersPage() {
    const benefits: Benefit[] = [
        {
            icon: DollarSign,
            title: "Kordhi Dakhligaaga",
            description: "Qeexso qiimaha aad rabto inaad shaqada kuqabto. shaqo cad, ma jiraan khidmado qarsoon.",
            gradient: "from-emerald-500 to-teal-600"
        },
        {
            icon: Calendar,
            title: "Si Dhamaystiran u nidaami",
            description: "Adiga ayaa madaxa ka ah. Shaqayso marka aad rabto, meel kasta oo aad rabto. Aqbal shaqooyinka jadwalkaaga.",
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            icon: Users,
            title: "Shabakad Sare",
            description: "Hel kumanaan macaamiil oo qiime sare leh oo si firfircoon u raadinaya xirfadlayaal la xaqiijiyay.",
            gradient: "from-purple-500 to-pink-600"
        },
        {
            icon: ShieldCheck,
            title: "Lacag Bixindhamays tiran",
            description: "Mar dambe ha raadinina biil. Lacag dhamaystiran oo toos ah oo shaqo kasta oo la dhammeeyo.",
            gradient: "from-amber-500 to-orange-600"
        },
        {
            icon: BarChart3,
            title: "Fahamka Ganacsiga",
            description: "La soco waxqabadkaaga, qiimahaaga, iyo kobcaaga iyada oo la adeegsanayo dashboard-kaaga si heer sare ah.",
            gradient: "from-primary to-blue-600"
        },
        {
            icon: Target,
            title: "Isku-xirka Caqliga Leh",
            description: "Algorithm-kayagu wuxuu kugu xirayaa shaqooyin si fiican ugu habboon xirfadahaaga iyo goobta.",
            gradient: "from-rose-500 to-red-600"
        }
    ];

    const steps: Step[] = [
        {
            number: "01",
            title: "Samee Profile-ka",
            description: "Muuji xirfadahaaga, khibradaada, iyo shaqadaada si aad uga muuqato dadka kale.",
            icon: Users,
            gradient: "from-blue-500 to-primary"
        },
        {
            number: "02",
            title: "La Xaqiijiyo",
            description: "Dhammaystir baaritaankayaga caadiga ah si aad u hesho calaamadda 'Xirfadle La Xaqiijiyay'.",
            icon: Shield,
            gradient: "from-primary to-indigo-600"
        },
        {
            number: "03",
            title: "Bilow Guulaha",
            description: "Hel codsiyada shaqada, soo gudbi qiimaha, oo bilow dhisida macaamiishaada.",
            icon: Zap,
            gradient: "from-indigo-600 to-purple-600"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Hero Section */}
            <section className="relative pt-12 md:pt-16 lg:pt-20 pb-20 overflow-hidden">
                {/* Cinematic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
                    <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>

                <div className="container px-6 md:px-12 lg:px-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Madal Loogu Talagalay Xirfadlayaasha</span>
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-[1.1]">
                                Xooji <br />
                                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Khibradaada.</span>
                            </h1>

                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                kusoo biir madasheena oo noqo xirafadlye bixiya adeegyo Tayo sare leh.
                                Ballaari hekitaankaaga macmiilka ,ka samee dhaqaale , oo dhis sumcad waarta.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link href="/register?role=provider" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-14 px-10 rounded-xl text-lg font-bold bg-primary shadow-xl hover:scale-105 active:scale-95 transition-all w-full">
                                        Isku diiwaan geli Adeeg-bixiye
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/how-it-works" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="h-14 px-10 rounded-xl text-lg font-bold border-2 hover:bg-muted/50 transition-all w-full">
                                        Habka
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust metrics */}
                            <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-border/50">
                                <div>
                                    <div className="text-2xl font-bold">90%</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dakhliga La Haysto</div>
                                </div>
                                <div className="w-px h-8 bg-border hidden sm:block" />
                                <div>
                                    <div className="text-2xl font-bold">2.5k+</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shaqooyin Bishii</div>
                                </div>
                                <div className="w-px h-8 bg-border hidden sm:block" />
                                <div>
                                    <div className="text-2xl font-bold">4.9/5</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Qanacsanaanta</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group lg:ml-auto w-full max-w-[500px] mx-auto">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 rounded-4xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent blur-2xl group-hover:opacity-100 transition-opacity opacity-50" />

                            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-4xl overflow-hidden border-2 border-border shadow-xl">
                                <Image
                                    src="/provider-hero.jpg"
                                    alt="Guusha Adeeg-bixiyaha"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                {/* Floating Overlay Card */}
                                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-background/90 backdrop-blur-xl border border-white/20 shadow-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-base">Guul La Xaqiijiyay</div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Xirfadle Lagu Kalsoon Yahay</div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full w-[95%] bg-emerald-500 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 relative overflow-hidden bg-muted/30">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl">
                            Sababta Xirfadlayaasha Ugu Fiican <br />
                            <span className="text-primary italic">Nagu Dooranayaan.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Ma bixinno oo kaliya shaqooyin, waxaan bixinaa kaabayaal <br className="hidden md:block" />
                            ganacsi si uu kordhiyo kobcaaga dhaqaale dhana dijitaal ka.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="group relative">
                                {/* Gradient Border Wrapper */}
                                <div className="absolute -inset-px rounded-[2.6rem] bg-gradient-to-br from-border/50 via-primary/5 to-border/50 group-hover:from-primary/50 group-hover:to-blue-600/50 transition-all duration-500 -z-10" />

                                <div className="h-full flex flex-col p-10 rounded-4xl glass border-border/5 transition-all duration-500 hover:bg-background/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3">
                                    {/* Icon Box */}
                                    <div className="relative mb-10 w-20 h-20">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <div className={`relative flex items-center justify-center w-full h-full rounded-3xl bg-gradient-to-br ${benefit.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <benefit.icon className="h-10 w-10" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed flex-1">
                                        {benefit.description}
                                    </p>

                                    {/* Subtle Indicator */}
                                    <div className="mt-8 h-1 w-12 rounded-full bg-muted group-hover:bg-primary group-hover:w-20 transition-all duration-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stepper Section */}
            <section className="pt-24 pb-12 md:pb-16 relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 text-[25vw] font-black text-primary/5 select-none -z-10 tracking-tighter uppercase whitespace-nowrap -translate-y-1/2">
                    Koboc
                </div>

                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="max-w-4xl mx-auto space-y-24">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter md:text-5xl">Jidkaaga Guusha</h2>
                            <p className="text-xl text-muted-foreground">Saddex tillaabo oo fudud si aad u furato awooda ganacsigaaga cusub.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-muted -z-10 overflow-hidden">
                                <div className="h-full w-1/2 bg-gradient-to-r from-primary to-blue-600 animate-slide-in" />
                            </div>

                            {steps.map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                                    <div className="relative w-28 h-28">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-4xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <div className={`relative flex items-center justify-center w-full h-full rounded-4xl bg-gradient-to-br ${step.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 font-black text-3xl`}>
                                            {step.number}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold">{step.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-primary/95 to-blue-800 px-8 py-16 md:px-16 md:py-20 shadow-2xl isolate transform hover:scale-[1.002] transition-transform duration-700 border border-white/10">
                        {/* Dynamic Background Elements */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] z-10" />
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/15 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

                        {/* Content - Centered and compact */}
                        <div className="relative z-20 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                            {/* Floating Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-md border border-white/20 shadow-lg">
                                <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                                <span>Ku Biir Guulaysatayaasha</span>
                            </div>

                            <div className="space-y-4">
                                {/* Main Heading */}
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] drop-shadow-sm">
                                    Diyaar Ma Tahay Inaad <br className="hidden md:block" />
                                    <span className="bg-gradient-to-r from-white via-blue-100 to-white/80 bg-clip-text text-transparent italic">
                                        Hormariso Ganacsigaaga?
                                    </span>
                                </h2>

                                {/* Subheading */}
                                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                                    Ku biir kumanaan xirfadlayaal ah oo maalin walba kor u qaadaya dakhligooda, iyagoo adeegsanaya madasheena casriga ah.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto pt-4">
                                <Link href="/register?role=provider" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold bg-white text-primary hover:bg-white/95 active:scale-95 transition-all duration-300 w-full sm:min-w-[220px] shadow-2xl group">
                                        Bilow Hadda
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/help" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl text-lg font-bold text-white border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 w-full sm:min-w-[220px]">
                                        La Xiriir Kooxda
                                    </Button>
                                </Link>
                            </div>

                            {/* Social Proof Footer - Compact & Refined */}
                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 opacity-90 border-t border-white/10 w-full justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2.5">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-primary bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center shadow-md overflow-hidden">
                                                <Users className="h-3.5 w-3.5 text-gray-700" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-white">2.5k+ Xirfadlayaal</div>
                                        <div className="flex text-yellow-500 gap-0.5">
                                            {[1, 2, 3, 4, 5].map(j => <Heart key={j} className="w-2 h-2 fill-current" />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block w-px h-6 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-white/90">100% Waa La Hubiyay</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

