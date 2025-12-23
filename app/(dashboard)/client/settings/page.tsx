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
            title: "Ogeysiisyada",
            description: "Go'aanso sidaan kula soo xiriirno",
            icon: Bell,
            color: "text-blue-600",
            bg: "bg-blue-50/50",
            href: "/client/settings/notifications",
        },
        {
            title: "Amniga",
            description: "Maamul password-kaaga iyo badbaadada akoonka",
            icon: Shield,
            color: "text-purple-600",
            bg: "bg-purple-50/50",
            href: "/client/settings/security",
        },
        {
            title: "Muuqaalka",
            description: "Habayso qaabka uu kuugu muuqdo dashboard-ka",
            icon: Moon,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50",
            href: "/client/settings/appearance",
        },
        {
            title: "Luqadda",
            description: "Dooro luqadda aad ku hadasho",
            icon: Globe,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
            href: "/client/settings/language",
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1.5 text-center md:text-left">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">Habaynta (Settings)</h1>
                <p className="text-sm text-gray-500">Maamul akoonkaaga iyo guud ahaan nidaamka app-ka</p>
            </div>

            <div className="grid gap-6">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Card
                            key={section.title}
                            onClick={() => router.push(section.href)}
                            className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 rounded-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer group"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${section.bg} ${section.color} transition-all duration-300 group-hover:scale-110 group-hover:bg-white ring-1 ring-transparent group-hover:ring-gray-100`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-gray-900 tracking-tight">{section.title}</h3>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{section.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-gray-100/50 mt-10">
                <Card
                    onClick={() => router.push("/client/settings/account")}
                    className="border-0 bg-red-50/30 backdrop-blur-md hover:bg-red-50/50 shadow-2xl shadow-red-500/5 ring-1 ring-red-100/50 rounded-2xl transition-all duration-500 cursor-pointer group"
                >
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white text-red-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="text-lg font-black text-gray-900">Maamulka Akoonka</h4>
                                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-tight">
                                        Jooji ama tirtir akoonkaaga. Markii aad tirtirto, wax dib u soo celin ah ma jirto.
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
