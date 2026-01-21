"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Save, CheckCircle2, Briefcase, MapPin } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ProviderProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        city: "",
        bio: "",
        image: "" as string | null,
    });

    useEffect(() => {
        const fetchProviderData = async () => {
            if (session?.user) {
                try {
                    const response = await fetch("/api/provider/me");
                    if (response.ok) {
                        const data = await response.json();
                        setFormData({
                            name: session.user.name || "",
                            category: data.category || "",
                            city: data.city || "",
                            bio: data.bio || "",
                            image: data.user?.image || "",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch provider details", error);
                }
            }
        };

        fetchProviderData();
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch("/api/provider/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                // Update the session for Name change
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
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col gap-1.5 text-center md:text-left">
                <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Profile-ka Xirfadlaha</h1>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Sida macaamiishu kuu arkaan markay adeeg raadinayaan.</p>
            </div>

            <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-4xl overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 opacity-90" />
                <div className="px-6 -mt-10 pb-8">
                    <div className="relative inline-block">
                        <ImageUpload
                            currentImage={formData.image}
                            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                            className="ring-4 ring-background shadow-xl rounded-2xl"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Magaca Ganacsiga (ama kanaga)</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 border-border bg-muted/30 focus:bg-muted focus:ring-2 focus:ring-primary/10 transition-all rounded-xl text-sm font-bold text-foreground"
                                    placeholder="Gali magacaaga ama ganacsigaaga"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nooca Adeegga</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="h-12 border-border bg-muted/30 focus:bg-muted focus:ring-2 focus:ring-primary/10 transition-all rounded-xl text-sm font-bold text-foreground">
                                        <SelectValue placeholder="Dooro Nooca" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electrician">Korantayste</SelectItem>
                                        <SelectItem value="Plumber">Tuubayste</SelectItem>
                                        <SelectItem value="Home Cleaning">Nadaafad</SelectItem>
                                        <SelectItem value="AC Repair">Habaynta Qaboojiyasha</SelectItem>
                                        <SelectItem value="Mechanic">Mechanic</SelectItem>
                                        <SelectItem value="Tutoring">Bare</SelectItem>
                                        <SelectItem value="Other">Shaqa bixiye guud</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Magaalada Adeegga</Label>
                                <Select
                                    value={formData.city}
                                    onValueChange={(val: any) => setFormData({ ...formData, city: val })}
                                >
                                    <SelectTrigger className="h-12 border-border bg-muted/30 focus:bg-muted focus:ring-2 focus:ring-primary/10 transition-all rounded-xl text-sm font-bold text-foreground">
                                        <SelectValue placeholder="Dooro Magaalada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mogadishu">Mogadishu</SelectItem>
                                        <SelectItem value="Hargeisa">Hargeisa</SelectItem>
                                        <SelectItem value="Garowe">Garowe</SelectItem>
                                        <SelectItem value="Kismayo">Kismayo</SelectItem>
                                        <SelectItem value="Baidoa">Baidoa</SelectItem>
                                        <SelectItem value="Cerigaabo">Cerigaabo</SelectItem>
                                        <SelectItem value="Bosaaso">Bosaaso</SelectItem>
                                        <SelectItem value="Laascanood">Laascanood</SelectItem>
                                        <SelectItem value="Burtinle">Burtinle</SelectItem>
                                        <SelectItem value="Dhusamareeb">Dhusamareeb</SelectItem>
                                        <SelectItem value="Cadaado">Cadaado</SelectItem>
                                        <SelectItem value="Beledweyne">Beledweyne</SelectItem>
                                        <SelectItem value="Jawhar">Jawhar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="bio" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Faahfaahin (Bio)</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="min-h-[120px] border-border bg-muted/30 focus:bg-muted focus:ring-2 focus:ring-primary/10 transition-all rounded-xl text-sm font-medium text-foreground resize-none"
                                    placeholder="U sheeg macaamiisha khibradaada iyo adeegyada aad bixiso..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all text-xs uppercase tracking-widest border-0"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cusboonaysiin...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Cusboonaysii Profile-ka
                                    </>
                                )}
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-left-4">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">Si guul leh baa loo cusboonaysiiyay!</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}

