"use client";

import { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Send,
    Sparkles,
    CheckCircle2,
    Clock,
    Globe,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Fadlan buuxi dhamaan meelaha banaan ee muhiimka ah.");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Farriintaada waa la diray! Waan kugu soo jawaabi doonaa dhowaan.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitting(false);
    };

    const contactInfo = [
        {
            icon: Mail,
            label: "Email noo soo dir",
            value: "support@somaliservices.so",
            href: "mailto:support@somaliservices.so"
        },
        {
            icon: Phone,
            label: "Nala soo hadal",
            value: "+252 090 6575473",
            href: "tel:+2520906575473"
        },
        {
            icon: MapPin,
            label: "Xarunta dhexe",
            value: "Mogdisho, Somalia",
            href: "https://maps.google.com/?q=Mogdisho,Somalia"
        },
        {
            icon: Clock,
            label: "Saacadaha shaqada",
            value: "24/7 Service Support",
            href: null
        }
    ];

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Dynamic Background Elements */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse -z-10" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000 -z-10" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Nala Soo Xiriir</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8">
                        Sidee Kuugu <br />
                        <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Adeegi Karnaa?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Wax kasta oo aad u baahan tahay, annaga ayaa diyaar u ah inaan kaa caawino. Noo soo dir farriin.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-24 bg-muted/20 dark:bg-muted/5 relative overflow-hidden border-b border-border/10">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold tracking-tight">Macluumaadka Xiriirka</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Waxaan diyaar u nahay inaan jawaab ka bixinno su'aalahaaga 24/7.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {contactInfo.map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 rounded-2xl glass border-border/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <item.icon className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    target={item.icon === MapPin ? "_blank" : undefined}
                                                    rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                                                    className="text-2xl font-bold hover:text-primary transition-colors block"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-2xl font-bold">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Proof */}
                            <div className="p-8 rounded-4xl bg-background border border-border/50 shadow-sm space-y-4">
                                <p className="font-bold">Guud ahaan dalka oo dhan</p>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                            <Globe className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                                        +5k
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">Ku biir kumanaan qof oo nagu kalsoon.</p>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-7">
                            <form onSubmit={handleSubmit} className="p-10 md:p-14 rounded-4xl glass border-border/10 shadow-3xl space-y-10 relative overflow-hidden backdrop-blur-2xl">
                                <div className="absolute top-0 right-0 p-12 text-primary/5 -z-10 rotate-12">
                                    <Send className="h-32 w-32" />
                                </div>
                                <div className="space-y-8">
                                    <h3 className="text-3xl font-bold">Noo Soo Dir Farriin</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold ml-1 text-muted-foreground">Magacaaga</label>
                                            <Input
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Tusaale: Maxamed Cali"
                                                className="h-16 rounded-2xl border-2 bg-background/50 focus:border-primary/50 text-base"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold ml-1 text-muted-foreground">Email-kaaga</label>
                                            <Input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="tusaale@email.com"
                                                className="h-16 rounded-2xl border-2 bg-background/50 focus:border-primary/50 text-base"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold ml-1 text-muted-foreground">Mawduuca</label>
                                        <Input
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="Muxuu ku saabsan yahay xiriirkaaga?"
                                            className="h-16 rounded-2xl border-2 bg-background/50 focus:border-primary/50 text-base"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold ml-1 text-muted-foreground">Farriintaada</label>
                                        <Textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Halkaan ku qor farriintaada..."
                                            className="min-h-[180px] rounded-2xl border-2 bg-background/50 focus:border-primary/50 py-5 text-base"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-16 rounded-3xl bg-primary text-xl font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                Waa la dirayaa...
                                            </>
                                        ) : (
                                            <>
                                                Soo Dir Farriinta
                                                <Send className="ml-3 h-6 w-6" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground font-medium">
                                        Waxaan kugu soo jawaabaynaa muddo 24 saac gudahood ah.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

