import { Gavel, ShieldCheck, CreditCard, Scale, Sparkles, AlertCircle } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Header */}
            <section className="relative pt-24 pb-20 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Background Element */}
                <div className="absolute top-10 left-10 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Scale className="h-3.5 w-3.5" />
                        <span>Shuruudaha & Qawaaniinta</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                        Shuruudaha <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Isticmaalka</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Fadlan si taxadar leh u akhri shuruudahan ka hor inta aanad bilaabin isticmaalka SomaliServices.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-24">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="max-w-4xl mx-auto space-y-16">

                        {/* Section 1 */}
                        <div className="space-y-6 p-10 rounded-4xl glass border-border/5">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Gavel className="h-5 w-5" />
                                </div>
                                1. Heshiiska Guud
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                <p>Isticmaalka SomaliServices waxay ka dhigan tahay inaad oggolaatay dhammaan shuruudaha halkan ku qoran. Haddii aanad oggolayn, fadlan ha isticmaalin madasheena. Waxaan xaq u leenahay inaan beddelno shuruudahan wakhti kasta.</p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-6 p-10 rounded-4xl glass border-border/5">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                2. Mas'uuliyadda Isticmaalaha
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                                <p>Isticmaale kasta (Macmiil ama Adeeg-bixiye) waxaa laga rabaa:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Inuu bixiyo macluumaad sax ah oo run ah.</li>
                                    <li>Inuu u dhaqmo si xirfadnimo iyo ixtiraam leh.</li>
                                    <li>Inuusan isticmaalin madasheena ujeedooyin sharci darro ah.</li>
                                    <li>Inuu ilaaliyo sirta koontadiisa (Password-ka).</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 - Payments */}
                        <div id="payments" className="space-y-8 py-12 border-t border-border/50">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-primary" />
                                3. Lacag Bixinta Sugan (Secure Payments)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-3xl bg-background border border-border shadow-sm space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Amniga Lacagta</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Dhammaan lacag bixinta waxaa lagu maamulaa hab ammaan ah. Lacagtaada waa mid la sugu ilaa inta shaqadu ka dhammaanayso.
                                    </p>
                                </div>
                                <div className="p-8 rounded-3xl bg-background border border-border shadow-sm space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Habka Lacagta</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Waxaan isticmaalnaa hababka lacag bixinta mobile-ka ee dalka ugu caansan, iyadoo la raacayo shuruudaha amniga tignoolajiyada.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 -z-10" />
                            <h3 className="text-2xl font-bold">Ma Ubaahan Tahay Heshiis Gaar Ah?</h3>
                            <p className="text-white/80 max-w-xl mx-auto">
                                Haddii aad tahay shirkad weyn oo raba heshiisyo gaar ah oo ku saabsan adeegyada aan bixino, fadlan nala soo xiriir.
                            </p>
                            <a href="/contact" className="inline-block bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                                Nala Soo Xiriir
                            </a>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

