"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Moon, Globe, ChevronRight } from "lucide-react";

export default function ClientSettingsPage() {
    const settingsSections = [
        {
            title: "Notifications",
            description: "How we contact you about your requests.",
            icon: Bell,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Security",
            description: "Manage your password and account security.",
            icon: Shield,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Appearance",
            description: "Customize your dashboard theme.",
            icon: Moon,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "Language",
            description: "Choose your preferred language.",
            icon: Globe,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences and application settings.</p>
            </div>

            <div className="grid gap-6">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Card key={section.title} className="border-gray-100 hover:shadow-md transition-all cursor-pointer group">
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl">
                    <div className="space-y-1 text-center md:text-left">
                        <h4 className="text-xl font-bold">Delete Account</h4>
                        <p className="text-gray-400 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <Button variant="destructive" className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-red-500/20">
                        Deactivate Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
