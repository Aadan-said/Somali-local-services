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
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/client/settings")}
                    className="rounded-xl"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Appearance</h1>
                    <p className="text-gray-500">Dooro qaabka dashboard-kaaga</p>
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
                            className={`cursor-pointer transition-all hover:shadow-lg ${isSelected
                                    ? "border-purple-600 border-2 shadow-lg shadow-purple-500/20"
                                    : "border-gray-200 hover:border-purple-300"
                                }`}
                        >
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-xl ${isSelected ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    {isSelected && (
                                        <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center">
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className={`h-24 rounded-xl border-2 ${theme.preview}`}></div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{theme.title}</h3>
                                    <p className="text-sm text-gray-500">{theme.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-12 px-8 font-bold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20"
                >
                    {saving ? "Keydinta..." : "Keydi Theme"}
                </Button>
            </div>
        </div>
    );
}
