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
                <h1 className="text-2xl font-black tracking-tight text-gray-900 text-center md:text-left">Profile-kaaga</h1>
                <p className="text-sm text-gray-500 text-center md:text-left">Maamul xogtaada gaarka ah iyo sida dadka kale kuu arkaan.</p>
            </div>

            <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 rounded-2xl overflow-hidden">
                <div className="h-28 bg-linear-to-r from-primary via-indigo-600 to-blue-600" />
                <div className="px-6 -mt-10 pb-6">
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
                            className="ring-4 ring-white shadow-xl rounded-xl"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-gray-500">Magacaaga oo buuxa</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-11 border-gray-100 bg-white/50 focus:bg-white transition-all rounded-xl text-sm font-bold"
                                    placeholder="Gali magacaaga oo buuxa"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-gray-500">Iimaylkaaga (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="h-11 border-gray-100 bg-gray-50/30 cursor-not-allowed opacity-60 rounded-xl text-sm font-medium"
                                    placeholder="Email-kaaga"
                                />
                                <p className="text-[9px] text-gray-400 font-bold italic uppercase tracking-tighter">Email-ka lama bedeli karo sababo ammaan awgood.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 px-8 bg-linear-to-r from-primary to-blue-600 hover:from-indigo-600 hover:to-primary text-white font-black rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                        Waa la keydinayaa...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-3.5 w-3.5" />
                                        Keydi Isbedelka
                                    </>
                                )}
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-4">
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
