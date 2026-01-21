import {
    Sparkles,
    Users,
    Globe,
    Target,
    Heart,
    ShieldCheck,
    Newspaper,
    Users2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Dynamic Background Elements */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse -z-10" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000 -z-10" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Sheekadayada iyo Hadafkayaga</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8">
                        S.L.S Madasha <br />
                        <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Mustaqbalka</span> Somalia.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        SomaliServices waa madasha ugu weyn ee dalka ee isku xirta xirfadlayaasha tayada leh iyo qoysaska raadinaya adeegyo la aamini karo.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-24 bg-muted/20 dark:bg-muted/5 relative -isolate overflow-hidden">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight">Sheekadayada</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Waxaan bilownay annagoo leh hal ujeedo: Inaan fududayno helitaanka adeegyo tayo leh gudaha Somalia. Waxaan aragnay baahida loo qabo madal hufan oo isku xirta xirfadlayaasha iyo macaamiisha.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Maanta, SomaliServices waa madal ay kumanaan qof ku kalsoon yihiin si ay u helaan shaqooyin, kor ugu qaadaan ganacsigooda, oo ay u helaan adeegyo hufan.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/50">
                                <div>
                                    <div className="text-3xl font-bold text-primary">2025</div>
                                    <p className="text-sm font-medium text-muted-foreground">La aasaasay</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">5,000+</div>
                                    <p className="text-sm font-medium text-muted-foreground">Xirfadlayaal</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl border border-border/40 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                <Globe className="h-24 w-24 text-primary opacity-20 group-hover:opacity-40 transition-all animate-float" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Local Impact */}
            <section id="impact" className="py-24 relative overflow-hidden">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-black tracking-tight">Saamaynta Maxaliga Ah</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Waxa aan dhisaynaa ma aha oo kaliya ganacsi, ee waa kaabayaal dhaqaale oo kor u qaadaya nolosha dadka Soomaaliyeed.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: "Fursado Shaqo",
                                description: "Waxaan u abuuranay fursado shaqo xirfadlayaal badan oo dalka jooga."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Kalsooni & Amni",
                                description: "Waxaan dhisaynaa kalsooni dhex marta adeeg-bixiyaha iyo macmiilka."
                            },
                            {
                                icon: Heart,
                                title: "Kobaca Dhaqaalaha",
                                description: "Waxaan ka qayb qaadanaynaa kobaca dhaqaalaha dijitaalka ah ee dalka."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-4xl glass border-border/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsroom */}
            <section id="news" className="py-24 bg-muted/20 dark:bg-muted/5 border-y border-border/10">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 font-sans">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tight">Newsroom</h2>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Halkaan ka hel wararkii ugu dambeeyay iyo horumarada madasheena.
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-xl h-12 px-8 border-2 font-bold hover:bg-primary hover:text-white transition-all">Arag Dhammaan</Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-8 p-8 rounded-4xl glass border-border/5 hover:border-primary/20 transition-all group">
                                <div className="w-full md:w-56 shrink-0 aspect-video rounded-3xl bg-muted/50 dark:bg-card overflow-hidden flex items-center justify-center border border-border/10 group-hover:border-primary/20 transition-all">
                                    <Newspaper className="h-10 w-10 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-full">Jan 2026</div>
                                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight">SomaliServices oo gaartay 5,000 oo xirfadlayaal ah.</h3>
                                    <p className="text-base text-muted-foreground leading-relaxed">Maanta waxaan gaarnay guul weyn oo muujinaysa kobaca madashayada iyo kalsoonida bulshada...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community */}
            <section id="community" className="py-24">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="relative overflow-hidden rounded-[3rem] bg-primary px-8 py-20 text-center text-white isolate">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent -z-10" />
                        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
                                <Users2 className="h-4 w-4" />
                                Bulshada SomaliServices
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black">Nagu Soo Biir Maanta</h2>
                            <p className="text-xl text-white/80">
                                Noqo qayb ka mid ah macamiisha bulshada Soomaaliyeed . Waan kugu soo dhowaynaynaa Gacmo furan.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 px-10 text-lg font-bold">
                                        Is Diiwaangeli
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="border-white/30 text-black hover:bg-white/10 rounded-2xl h-14 px-10 text-lg font-bold">
                                        Nala Soo Xiriir
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

