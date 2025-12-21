"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Moon, Globe, ChevronRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientSettingsPage() {
    const router = useRouter();

    const settingsSections = [
        {
            title: "Notifications",
            description: "Sidaan kugula xiriirno codsigaaga",
            icon: Bell,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/client/settings/notifications",
        },
        {
            title: "Security",
            description: "Maamul password-kaaga iyo amniga account-kaaga",
            icon: Shield,
            color: "text-purple-600",
            bg: "bg-purple-50",
            href: "/client/settings/security",
        },
        {
            title: "Appearance",
            description: "Dooro qaabka dashboard-kaaga",
            icon: Moon,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            href: "/client/settings/appearance",
        },
        {
            title: "Language",
            description: "Dooro luqadda aad jeceshahay",
            icon: Globe,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            href: "/client/settings/language",
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500">Maamul account-kaaga iyo application settings-ka</p>
            </div>

            <div className="grid gap-6">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Card
                            key={section.title}
                            onClick={() => router.push(section.href)}
                            className="border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${section.bg} ${section.color} transition-transform group-hover:scale-110`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                                            <p className="text-sm text-gray-500">{section.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="pt-8 border-t border-gray-100 mt-12">
                <Card
                    onClick={() => router.push("/client/settings/account")}
                    className="border-red-200 bg-red-50/50 hover:shadow-lg transition-all cursor-pointer group"
                >
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-100 text-red-600 transition-transform group-hover:scale-110">
                                    <Trash2 className="h-6 w-6" />
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold text-gray-900">Account Management</h4>
                                    <p className="text-gray-600 text-sm">
                                        Jooji ama tirtir account-kaaga. Markii aad tirtirto, wax dib u soo celin ah ma jirto.
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-red-600 transition-colors" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
