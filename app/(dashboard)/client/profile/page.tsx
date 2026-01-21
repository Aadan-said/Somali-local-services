"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Save, CheckCircle2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ClientProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "" as string | null,
    });

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
            });
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                // Update the session to reflect changes
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                    },
                });
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-black tracking-tight text-foreground text-center md:text-left">Profile-kaaga</h1>
                <p className="text-sm text-muted-foreground text-center md:text-left">Maamul xogtaada gaarka ah iyo sida dadka kale kuu arkaan.</p>
            </div>

            <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-4xl overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 opacity-90" />
                <div className="px-6 -mt-10 pb-8">
                    <div className="relative inline-block">
                        <ImageUpload
                            currentImage={formData.image}
                            onUploadSuccess={async (url) => {
                                setFormData({ ...formData, image: url });
                                // Also update the session immediately
                                await update({
                                    ...session,
                                    user: {
                                        ...session?.user,
                                        image: url,
                                    },
                                });
                            }}
                            className="ring-4 ring-background shadow-xl rounded-2xl"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Magacaaga oo buuxa</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 border-border bg-muted/30 focus:bg-muted focus:ring-2 focus:ring-primary/10 transition-all rounded-xl text-sm font-bold text-foreground"
                                    placeholder="Gali magacaaga oo buuxa"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Iimaylkaaga (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="h-12 border-border/50 bg-muted/20 cursor-not-allowed opacity-50 rounded-xl text-sm font-medium text-muted-foreground"
                                    placeholder="Email-kaaga"
                                />
                                <p className="text-[9px] text-muted-foreground/60 font-black italic uppercase tracking-wider ml-1">Email-ka lama bedeli karo sababo ammaan awgood.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 text-xs uppercase tracking-widest border-0"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Waa la keydinayaa...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Keydi Isbedelka
                                    </>
                                )}
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-left-4">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">Si guul leh baa loo keydiyay!</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}

