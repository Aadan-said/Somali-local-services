import {
    Briefcase,
    Zap,
    Users,
    Rocket,
    Globe,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Clock,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
    const openings = [
        {
            title: "Frontend Developer (Next.js)",
            department: "Engineering",
            type: "Remote / Mogadishu",
            time: "Full-time"
        },
        {
            title: "Operations Manager",
            department: "Operations",
            type: "Mogadishu",
            time: "Full-time"
        },
        {
            title: "Customer Support Lead",
            department: "Support",
            type: "Remote",
            time: "Part-time"
        },
        {
            title: "Marketing Specialist",
            department: "Growth",
            type: "Mogadishu",
            time: "Full-time"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Dynamic Background Elements */}
                <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse -z-10" />
                <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700 -z-10" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Ku Soo Biir Kooxdayada</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8">
                        Dhis Hormarka <br />
                        <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Mustaqbalkaaga</span> Hadda.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
                        SomaliServices waa koox dhalinyaro firfircoon ah oo ka shaqaynaya sidii loo beddeli lahaa nolosha dadka Soomaaliyeed iyadoo la adeegsanayo tignoolajiyada.
                    </p>
                    <div className="flex justify-center">
                        <Link href="#openings">
                            <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold bg-primary shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                Arag Boosaska Banaan
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-24 bg-muted/20 dark:bg-muted/5 relative overflow-hidden">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-black tracking-tight">Maxaad Noogu Soo Biiraysaa?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Waxaan bixinaa deegaan shaqo oo dhiirigelin leh, fursado koboc, iyo hiraal fog.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Rocket,
                                title: "Koboc Degdeg Ah",
                                description: "Fursad aad ku baran karto xirfado cusub oo aad ku kici karto."
                            },
                            {
                                icon: Users,
                                title: "Koox Fiican",
                                description: "La shaqee dhalinyaro aqoon leh oo leh hiraal weyn."
                            },
                            {
                                icon: Globe,
                                title: "Saameyn weyn",
                                description: "Shaqadaada waxay saameyn dhab ah ku leedahay nolosha dadka."
                            },
                            {
                                icon: Zap,
                                title: "Tignoolajiyada",
                                description: "U adeegso aaladaha iyo tignoolajiyada ugu dambeeya."
                            }
                        ].map((benefit, i) => (
                            <div key={i} className="p-10 rounded-4xl glass border-border/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all group text-center">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 mx-auto group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <benefit.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="openings" className="py-24">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tight">Boosaska Banaan</h2>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                Raadi booska ku habboon xirfadaada oo nagu soo biir maanta.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 border rounded-full text-sm font-medium bg-muted">Dhammaan</div>
                            <div className="px-4 py-2 border rounded-full text-sm font-medium hover:bg-muted cursor-pointer transition-colors">Engineering</div>
                            <div className="px-4 py-2 border rounded-full text-sm font-medium hover:bg-muted cursor-pointer transition-colors">Marketing</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {openings.map((job, i) => (
                            <div key={i} className="group flex flex-col md:flex-row items-center justify-between p-10 rounded-4xl glass border-border/5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all">
                                <div className="space-y-4 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
                                        {job.department}
                                    </div>
                                    <h3 className="text-3xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-base text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary/60" />
                                            {job.type}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary/60" />
                                            {job.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <Button variant="outline" className="rounded-2xl h-14 px-10 border-2 font-bold hover:bg-primary hover:text-white transition-all text-base">
                                        Codso Hadda
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-12 rounded-[3rem] bg-gradient-to-br from-primary via-blue-600 to-indigo-600 text-white text-center shadow-2xl">
                        <h3 className="text-3xl font-bold mb-4">Ma Waysay Boos Ku Habboon?</h3>
                        <p className="text-xl text-white/80 mb-8">
                            Haddii aad tahay qof karti leh, nala soo xiriir oo noo sheeg sida aad wax ugu dari kartid Barnamij keena.
                        </p>
                        <a href="mailto:careers@somaliservices.so">
                            <Button variant="outline" className="h-14 px-10 rounded-2xl text-lg font-bold border-white/30 text-black hover:bg-white/10">
                                Noo Soo Dir Email
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

