import { Shield, Lock, Eye, FileText, Sparkles } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Header */}
            <section className="relative pt-24 pb-20 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Background Element */}
                <div className="absolute top-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Amniga & Asturnaanta</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                        Siyaasadda <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Asturnaanta</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Waxaa naga go'an inaan ilaalinno xogtaada gaarka ah iyo asturnaantaada mar kasta oo aad isticmaalayso madasheena.
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
                                    <FileText className="h-5 w-5" />
                                </div>
                                1. Xogta aan uruurino
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                                <p>Markaad isu diiwaangelinayso SomaliServices, waxaan uruurinnaa macluumaadka soo socda:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Magacaaga oo buuxa iyo sawirka profile-ka.</li>
                                    <li>Email-ka iyo lambarka taleefanka.</li>
                                    <li>Xogta goobta (Location) si aan kuugu xirno dadka kuu dhow.</li>
                                    <li>Macluumaadka lacag bixinta (EVC, Sahal, iwm).</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-6 p-10 rounded-4xl glass border-border/5">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Eye className="h-5 w-5" />
                                </div>
                                2. Sida aan u isticmaalno xogtaada
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                                <p>Waxaan u isticmaalnaa macluumaadkaaga si aan:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Kuugu fadhino adeeg bixiye ama macmiil kugu habboon.</li>
                                    <li>U fududayno xiriirka dhex maraya labada dhinac.</li>
                                    <li>U hubinno ammaanka iyo kalsoonida madasheena.</li>
                                    <li>Ugu soo dirno ogeysiisyada muhiimka ah ee shaqadaada.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 - Cookies */}
                        <div id="cookies" className="space-y-6 p-10 rounded-4xl glass border-border/5">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Shield className="h-5 w-5" />
                                </div>
                                3. Siyaasadda Cookies-ka
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                                <p>SomaliServices waxay isticmaashaa cookies si ay u wanaajiso khibradaada. Cookies-ku waxay naga caawiyaan:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Inaan ku aqoonsanno markaad dib ugu soo laabato madasheena.</li>
                                    <li>Inaan fahanno sida dadku u isticmaalaan adeegayaga si aan u sii qurxinno.</li>
                                    <li>Inaan kuu keydinno dookhyadaada (Preferences).</li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center space-y-4">
                            <p className="font-bold">Ma qabtaa su'aalo dheeraad ah?</p>
                            <p className="text-sm text-muted-foreground">
                                Haddii aad rabto inaad wax kale ka ogaato siyaasadeena asturnaanta, fadlan nala soo xiriir
                                <a href="/contact" className="text-primary font-bold ml-1 hover:underline">Support Center</a>.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

