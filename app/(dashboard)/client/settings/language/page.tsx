"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LanguagePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("so");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/user/settings");
            const data = await res.json();
            setSelectedLanguage(data.language || "so");
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
                body: JSON.stringify({ language: selectedLanguage }),
            });

            if (res.ok) {
                alert("Luqadda waa la keydiyay!");
            } else {
                alert("Khalad ayaa dhacay!");
            }
        } catch (error) {
            console.error("Error saving language:", error);
            alert("Khalad ayaa dhacay!");
        } finally {
            setSaving(false);
        }
    };

    const languages = [
        {
            value: "so",
            title: "Somali",
            nativeName: "Af-Soomaali",
            flag: "🇸🇴",
        },
        {
            value: "en",
            title: "English",
            nativeName: "English",
            flag: "🇬🇧",
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
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Language</h1>
                    <p className="text-gray-500">Dooro luqadda aad jeceshahay</p>
                </div>
            </div>

            <div className="grid gap-6">
                {languages.map((language) => {
                    const isSelected = selectedLanguage === language.value;
                    return (
                        <Card
                            key={language.value}
                            onClick={() => setSelectedLanguage(language.value)}
                            className={`cursor-pointer transition-all hover:shadow-lg ${isSelected
                                    ? "border-purple-600 border-2 shadow-lg shadow-purple-500/20"
                                    : "border-gray-200 hover:border-purple-300"
                                }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-5xl">{language.flag}</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{language.title}</h3>
                                            <p className="text-sm text-gray-500">{language.nativeName}</p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                                            <Check className="h-5 w-5 text-white" />
                                        </div>
                                    )}
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
                    {saving ? "Keydinta..." : "Keydi Luqadda"}
                </Button>
            </div>
        </div>
    );
}
