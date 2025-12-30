"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Send, MapPin, Calendar, Loader2, CheckCircle2, ChevronDown, Layers, DollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateRequestPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        category: "",
        description: "",
        location: "",
        serviceDate: "",
        price: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/requests/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/client/requests");
                }, 2000);
            } else {
                alert("Failed to create request. Please try again.");
            }
        } catch (error) {
            console.error("Error creating request:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto py-24 text-center space-y-8 relative">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />

                <div className="flex justify-center relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="relative h-28 w-28 rounded-4xl bg-linear-to-br from-white to-primary/5 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-white/50 animate-in zoom-in duration-700">
                        <CheckCircle2 className="h-14 w-14" />
                    </div>
                </div>
                <div className="space-y-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Codsigaaga waa la diray!</h1>
                    <p className="text-slate-600 font-medium text-lg max-w-sm mx-auto leading-relaxed">
                        Codsigaaga si guul leh ayaa loo keydiyay, waxaana loo bandhigay dhammaan xirfadlayaasha ku sugan Soomaaliya.
                    </p>
                </div>
                <div className="pt-6 flex flex-col items-center gap-3">
                    <div className="inline-flex items-center gap-2 text-sm text-primary font-bold bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Dib ugu laabo dashboard-ka...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-10 pb-24 relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/client"
                    className="group flex items-center gap-3"
                >
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 text-primary shadow-sm">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Codsi Cusub</span>
                </div>
            </div>

            {/* Main Title Area */}
            <div className="space-y-4 text-center py-4">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                    Maxaad maanta u <br />
                    <span className="bg-linear-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">baahantahay?</span>
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto">
                    Buuxi foomka hoose si aan kuugu helno xirfadle ku habboon baahidaada.
                </p>
            </div>

            {/* Premium Form Card */}
            <Card className="border-0 bg-white/60 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-visible ring-1 ring-white/60 relative">
                {/* Decorative gradients on card */}
                <div className="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

                <form onSubmit={handleSubmit} className="relative z-10">
                    <CardContent className="p-8 md:p-12 space-y-10">

                        {/* Service Selection */}
                        <div className="space-y-4">
                            <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <Layers className="h-3 w-3" /> Nooca Adeegga
                            </Label>
                            <div className="relative group">
                                <select
                                    id="category"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-16 bg-white border-0 ring-1 ring-slate-200 rounded-2xl px-6 pr-12 text-base font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all cursor-pointer hover:bg-slate-50"
                                >
                                    <option value="" className="text-slate-400">Dooro adeegg bixiyaha aad u baahantahay...</option>
                                    <option value="Electrician">Korontayste (Electrician)</option>
                                    <option value="Plumber">Tuubayste (Plumber)</option>
                                    <option value="Home Cleaning">Nadiifinta Guryaha (Cleaning)</option>
                                    <option value="AC Repair">Farsamada AC-ga (AC Repair)</option>
                                    <option value="Mechanic">Mikaanig (Mechanic)</option>
                                    <option value="Tutoring">Macallin/Cashirro (Tutoring)</option>
                                    <option value="Other">Adeege kale (Other)</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Sharaxaad kooban</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Si faahfaahsan noogu sheeg waxaad u baahantahay..."
                                className="min-h-[160px] bg-white border-0 ring-1 ring-slate-200 rounded-2xl p-6 text-base font-medium resize-none placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all hover:bg-slate-50"
                                required
                            />
                        </div>

                        {/* Budget / Price */}
                        <div className="space-y-4">
                            <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <DollarSign className="h-3 w-3" /> Qiimaha (Budget)
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="price"
                                    type="number"
                                    min="1"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Tusaale: $50"
                                    required
                                    className="h-16 bg-white border-0 ring-1 ring-slate-200 rounded-2xl pl-14 text-base font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all hover:bg-slate-50"
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 transition-colors">
                                    <DollarSign className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium ml-2">
                                * Qiimaha qiyaasta ah ee aad ku bixin karto shaqadan.
                            </p>
                        </div>

                        {/* Location & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Goobta</Label>
                                <div className="relative group">
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Tusaale: Galkio"
                                        required
                                        className="h-16 bg-white border-0 ring-1 ring-slate-200 rounded-2xl pl-14 text-base font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all hover:bg-slate-50"
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="serviceDate" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Taariikhda</Label>
                                <div className="relative group">
                                    <Input
                                        id="serviceDate"
                                        type="date"
                                        value={formData.serviceDate}
                                        onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                                        required
                                        className="h-16 bg-white border-0 ring-1 ring-slate-200 rounded-2xl pl-14 text-base font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all hover:bg-slate-50"
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-8 md:p-12 pt-0 flex flex-col md:flex-row gap-5">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => router.back()}
                            className="w-full md:w-auto h-16 px-8 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-xs uppercase tracking-widest"
                        >
                            Iska daa
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:flex-1 h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 hover:-translate-y-1"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="mr-2 h-5 w-5" />
                                    Dir Codsiga
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
