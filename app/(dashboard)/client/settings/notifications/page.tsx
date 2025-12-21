"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Megaphone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: true,
        requestUpdates: true,
        marketingEmails: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/user/settings");
            const data = await res.json();
            setSettings({
                emailNotifications: data.emailNotifications,
                smsNotifications: data.smsNotifications,
                requestUpdates: data.requestUpdates,
                marketingEmails: data.marketingEmails,
            });
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
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert("Settings waa la keydiyay!");
            } else {
                alert("Khalad ayaa dhacay!");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Khalad ayaa dhacay!");
        } finally {
            setSaving(false);
        }
    };

    const notificationOptions = [
        {
            key: "emailNotifications",
            title: "Email Notifications",
            description: "Hel emails marka wax cusub dhacaan",
            icon: Mail,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            key: "smsNotifications",
            title: "SMS Notifications",
            description: "Hel farriimo telefoon ah",
            icon: MessageSquare,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            key: "requestUpdates",
            title: "Request Updates",
            description: "Hel updates marka codsigaaga wax ka beddelmo",
            icon: Bell,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            key: "marketingEmails",
            title: "Marketing Emails",
            description: "Hel emails ku saabsan adeegyada cusub",
            icon: Megaphone,
            color: "text-orange-600",
            bg: "bg-orange-50",
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
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Notifications</h1>
                    <p className="text-gray-500">Maamul sidaan kugala xiriirno codsigaaga</p>
                </div>
            </div>

            <div className="grid gap-6">
                {notificationOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <Card key={option.key} className="border-gray-100 hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${option.bg} ${option.color}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{option.title}</h3>
                                            <p className="text-sm text-gray-500">{option.description}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings[option.key as keyof typeof settings]}
                                        onCheckedChange={(checked) =>
                                            setSettings({ ...settings, [option.key]: checked })
                                        }
                                    />
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
                    {saving ? "Keydinta..." : "Keydi Settings"}
                </Button>
            </div>
        </div>
    );
}
