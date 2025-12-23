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
            <section className="relative pt-12 pb-12 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-blue-50/50 to-background -z-10" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary border border-primary/20 backdrop-blur-sm transition-all hover:bg-primary/15 cursor-default">
                            <Sparkles className="h-4 w-4" />
                            <span>Hab Cad oo Lagu Kalsoon Yahay</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl">
                            Adeeg Fudud oo <br />
                            <span className="bg-linear-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">Degdeg ah</span>
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            Waxaan fududeynay sida aad u hesho oo aad ugu dalbanayso xirfadlayaal.
                            Dayactir degdeg ah iyo hawlo qorshaysan, dhammaantood waan ku qabanaynaa.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="pt-8 pb-12 md:pb-16 relative overflow-hidden">
                {/* Background Text Decor */}
                <div className="absolute top-0 right-0 text-[15vw] font-black text-primary/5 select-none -z-10 tracking-tighter uppercase whitespace-nowrap -rotate-6 translate-y-1/4">
                    Tillaabooyinka
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
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Soo Dir Codsigaaga</h2>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Si fudud u sharax waxa aad u baahan tahay. Hadday tahay cilad walba oo kuhaysta,
                                        ku dar faahfaahin badan si aad u hesho adeeg ku habboon.
                                    </p>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                        {[
                                            { icon: CheckCircle, text: "Ku dar sawirro" },
                                            { icon: CheckCircle, text: "Sheeg goobta" },
                                            { icon: CheckCircle, text: "Qeexso miisaaniyaddaada" },
                                            { icon: CheckCircle, text: "Dooro waqtiga ku haboon" }
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
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">La Xiriir Xirfadle</h2>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Madalsheenu waxay kugu xiraysaa xirfadlayaasha ugu fiican ee deegaankaaga.
                                        Waxay dib loo eegi doonaan codsigaaga oo ay aqbali doonaan hadday khibradoodu iyo waqtigoodu aad u ogolaatid.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: ShieldCheck, title: "Xirfadlayaal La Hubiyay", desc: "Baaritaan dhabta ah" },
                                            { icon: Star, title: "Qiimaha Ugu Sarreeya", desc: "Tayada ugu fiican" },
                                            { icon: Clock, title: "Isku-xir Degdeg ah", desc: "Wax ka yar 5 daqiiqo" },
                                            { icon: Zap, title: "Dalbasho Degdeg ah", desc: "Hal guji oo shaqayso" }
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
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shaqo Dhammaystiran & Bixi</h2>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Markii shaqada la dhammeeyo oo aad ku qanacdo, si fudud u sii daa lacagta.
                                        Ha iloobin inaad qiimayso khibradaada si aad u caawiso dadka kale!
                                    </p>
                                    <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-500/5 to-teal-500/5 border-2 border-emerald-500/10 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div className="font-bold">100% Dammaanad Qanacsanaanta</div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Haddii aadan ku qanacsanayn adeegga, kooxdeena taageerada ayaa diyaar ah 24/7 si ay kaaga caawiyaan xalinta dhibaatooyinka.
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
            <section className="pt-8 pb-12 md:pb-20">
                <div className="container px-4 md:px-6">
                    <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 md:px-12 md:py-16 shadow-2xl">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                        <div className="absolute bottom-0 left-20 -mb-20 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                            <div className="space-y-6 text-left">
                                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Diyaar Ma u Tahay <br />
                                    <span className="text-blue-200">Inaad Bilowdo?</span>
                                </h2>
                                <p className="text-lg text-white/90 max-w-xl">
                                    Ku biir kumanaan qoys oo Soomaaliyeed oo si fudud ku helay dayactirka guryahooda
                                    iyagoo ay u shaqeeyeen xirfadlayaal lagu kalsoon yahay.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <Link href="/register">
                                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-12 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                                            Samee Akoon
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/services">
                                        <Button variant="outline" size="lg" className="border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold px-8 h-12 rounded-xl hover:bg-white hover:text-primary hover:border-white transition-all">
                                            Fiiri Adeegyada
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Trust Stats - Compact Design */}
                            <div className="lg:pl-10">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl grid grid-cols-2 gap-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                                    <div>
                                        <div className="text-3xl font-black text-white mb-1">5,000+</div>
                                        <div className="text-sm font-medium text-blue-200">Qoys oo ku qanacsan</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-white mb-1">4.9/5</div>
                                        <div className="text-sm font-medium text-blue-200">Qiimaynta Macaamiisha</div>
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-blue-200">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-blue-600 border-2 border-primary flex items-center justify-center text-[10px] text-white font-bold">✓</div>
                                            ))}
                                        </div>
                                        <span className="ml-2">Xirfadlayaal la xaqiijiyay</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
