"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    ExternalLink,
    MapPin,
    Briefcase,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminProvidersPage() {
    const { data: session, status } = useSession();
    const [providers, setProviders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProviders = async () => {
        try {
            const response = await fetch("/api/admin/providers?pending=true");
            if (response.ok) {
                const data = await response.json();
                setProviders(data);
            }
        } catch (error) {
            console.error("Failed to fetch providers:", error);
            toast.error("Waan ku guuldareysanay inaan soo rarno xogta");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchProviders();
        }
    }, [status, session]);

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        redirect("/client");
    }

    const handleVerification = async (providerId: string, verified: boolean) => {
        try {
            const res = await fetch("/api/admin/providers", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerId, verified })
            });

            if (res.ok) {
                toast.success(verified ? "Xirfadlaha waa la ogolaaday" : "Codsigii waa la diiday");
                fetchProviders();
            } else {
                toast.error("Cillad ayaa dhacday");
            }
        } catch (error) {
            toast.error("Waan ku guuldareysanay inaan shaqadaan qabano");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Xaqiijinta <span className="text-primary">Providers-ka</span></h1>
                <p className="text-muted-foreground font-medium">Hubi oo ogolaaw adeeg bixiyayaasha cusub ee raba inay ku soo biiraan.</p>
            </div>

            <div className="grid gap-6">
                {providers.length > 0 ? (
                    providers.map((provider) => (
                        <Card key={provider.id} className="border-border/50 bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden group hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
                                        {provider.user?.image ? (
                                            <img src={provider.user.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            provider.user?.name?.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-black">{provider.user?.name}</CardTitle>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium mt-1">
                                            <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {provider.category}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {provider.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="rounded-lg text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-500/5 border-orange-500/20">
                                        Wuxuu Sugayaa Hubin
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                                    <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                                        "{provider.bio || "No bio provided"}"
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <Button
                                        className="w-full sm:w-auto rounded-xl font-bold gap-2 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleVerification(provider.id, true)}
                                    >
                                        <CheckCircle2 className="h-4 w-4" /> Ogolaaw (Approve)
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto rounded-xl font-bold gap-2 text-red-500 hover:bg-red-500/5"
                                        onClick={() => handleVerification(provider.id, false)}
                                    >
                                        <XCircle className="h-4 w-4" /> Iska diid (Reject)
                                    </Button>
                                    <Button variant="ghost" className="w-full sm:w-auto rounded-xl font-bold gap-2 ml-auto" asChild>
                                        <Link href={`/provider-profile/${provider.userId}`}>
                                            <ExternalLink className="h-4 w-4" /> Eeg Profile-ka
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                        <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-bold">Ma jiraan providers sugaaya hubin hadda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
