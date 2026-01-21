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
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            href: "/client/settings/notifications",
        },
        {
            title: "Amniga",
            description: "Maamul password-kaaga iyo badbaadada akoonka",
            icon: Shield,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: "/client/settings/security",
        },
        {
            title: "Muuqaalka",
            description: "Habayso qaabka uu kuugu muuqdo dashboard-ka",
            icon: Moon,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            href: "/client/settings/appearance",
        },
        {
            title: "Luqadda",
            description: "Dooro luqadda aad ku hadasho",
            icon: Globe,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/client/settings/language",
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1.5 text-center md:text-left">
                <h1 className="text-2xl font-black tracking-tight text-foreground">Habaynta (Settings)</h1>
                <p className="text-sm text-muted-foreground">Maamul akoonkaaga iyo guud ahaan nidaamka app-ka</p>
            </div>

            <div className="grid gap-6">
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Card
                            key={section.title}
                            onClick={() => router.push(section.href)}
                            className="border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-4xl hover:shadow-foreground/10 transition-all duration-300 cursor-pointer group"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl ${section.bg} ${section.color} transition-all duration-300 group-hover:scale-110 group-hover:bg-background ring-1 ring-transparent group-hover:ring-border`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-foreground tracking-tight">{section.title}</h3>
                                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">{section.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-border/50 mt-10">
                <Card
                    onClick={() => router.push("/client/settings/account")}
                    className="border-0 bg-red-500/5 backdrop-blur-md hover:bg-red-500/10 shadow-2xl shadow-red-500/5 ring-1 ring-red-500/20 rounded-4xl transition-all duration-500 cursor-pointer group"
                >
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-xl bg-background text-red-500 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 border border-border">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="text-lg font-black text-foreground">Maamulka Akoonka</h4>
                                    <p className="text-muted-foreground text-[11px] font-black uppercase tracking-tight">
                                        Jooji ama tirtir akoonkaaga. Markii aad tirtirto, wax dib u soo celin ah ma jirto.
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-red-500 transition-colors" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
