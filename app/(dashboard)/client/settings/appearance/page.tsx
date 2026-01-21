"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppearancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("system");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/user/settings");
            const data = await res.json();
            setSelectedTheme(data.theme || "system");
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: selectedTheme }),
            });

            if (res.ok) {
                alert("Theme waa la keydiyay!");
            } else {
                alert("Khalad ayaa dhacay!");
            }
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("Khalad ayaa dhacay!");
        } finally {
            setSaving(false);
        }
    };

    const themes = [
        {
            value: "light",
            title: "Light",
            description: "Midab cad oo ifaya",
            icon: Sun,
            preview: "bg-white border-gray-200",
        },
        {
            value: "dark",
            title: "Dark",
            description: "Midab madow oo indho jilicsan",
            icon: Moon,
            preview: "bg-gray-900 border-gray-700",
        },
        {
            value: "system",
            title: "System",
            description: "Raac qaabka computer-kaaga",
            icon: Monitor,
            preview: "bg-gradient-to-br from-white to-gray-900 border-gray-400",
        },
    ];

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-muted rounded-xl w-1/4"></div>
                    <div className="h-6 bg-muted rounded-xl w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <div className="flex items-center gap-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/client/settings")}
                    className="h-12 w-12 rounded-2xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Muuqaalka</h1>
                    <p className="text-sm text-muted-foreground font-black uppercase tracking-widest">Dooro qaabka uu kuugu egyahay dashboard-kaaga</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {themes.map((theme) => {
                    const Icon = theme.icon;
                    const isSelected = selectedTheme === theme.value;
                    return (
                        <Card
                            key={theme.value}
                            onClick={() => setSelectedTheme(theme.value)}
                            className={`cursor-pointer transition-all duration-300 rounded-4xl border-0 ring-1 backdrop-blur-xl ${isSelected
                                ? "bg-primary/5 ring-primary shadow-2xl shadow-primary/10"
                                : "bg-card/40 ring-border hover:ring-primary/30 hover:bg-card/60 hover:shadow-2xl hover:shadow-foreground/5"
                                }`}
                        >
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-4 rounded-2xl transition-all duration-300 ${isSelected ? "bg-primary text-white scale-110 rotate-3 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                                        }`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    {isSelected && (
                                        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-in zoom-in duration-300">
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className={`h-28 rounded-2xl border-2 transition-all duration-500 overflow-hidden shadow-inner ${theme.preview} ${isSelected ? "scale-[1.02]" : ""}`}>
                                    {theme.value === "system" && (
                                        <div className="w-full h-full flex">
                                            <div className="w-1/2 h-full bg-white" />
                                            <div className="w-1/2 h-full bg-slate-950" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-foreground tracking-tight">{theme.title}</h3>
                                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">{theme.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-end pt-8 border-t border-border/50 mt-12">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-10 font-black rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] border-0 text-xs uppercase tracking-widest"
                >
                    {saving ? (
                        <div className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Cusboonaysiin...
                        </div>
                    ) : "Keydi Isbedelka"}
                </Button>
            </div>
        </div>
    );
}
