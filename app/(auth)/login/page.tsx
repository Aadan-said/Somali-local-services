"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, User as UserIcon, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");
    const [role, setRole] = useState<"client" | "provider">("client");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (urlError === "Configuration") {
            setError("Nidaamka login-ka (NextAuth) ayaan sifiican u habaysnayn. Fadlan hubi NEXTAUTH_SECRET.");
        } else if (urlError) {
            setError("Khalad ayaa ka dhacay dhinaca server-ka.");
        }
    }, [urlError]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ama password-ka ayaa khaldan");
            } else {
                router.push(role === "client" ? "/client" : "/provider");
                router.refresh();
            }
        } catch (err) {
            setError("Khalad ayaa dhacay. Fadlan mar kale isku day.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto py-4">
            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-3 ring-4 ring-primary/5">
                    <LogIn className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">Welcome Back</h1>
                <p className="text-sm text-gray-400 font-medium tracking-tight">Soo laabo si aad u maamusho shaqooyinkaaga</p>
            </div>

            <Card className="border border-gray-100 shadow-xl shadow-gray-200/20 bg-white overflow-hidden rounded-2xl">
                <div className="h-1.5 bg-linear-to-r from-primary to-blue-600" />

                <CardHeader className="pt-6 px-6">
                    <CardTitle className="text-lg font-bold text-gray-900">Welcome Back</CardTitle>
                    <CardDescription className="text-xs text-gray-400">Gali macluumaadkaaga hoos ku qoran</CardDescription>
                </CardHeader>

                <form onSubmit={onSubmit}>
                    <CardContent className="px-6 py-4 space-y-5">
                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                                    role === "client"
                                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                )}
                            >
                                <UserIcon className="h-3.5 w-3.5" />
                                Macmiil
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("provider")}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                                    role === "provider"
                                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                )}
                            >
                                <Briefcase className="h-3.5 w-3.5" />
                                Adeeg-bixiye
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">Email-kaaga</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="pl-9 h-11 rounded-lg bg-white border-gray-200 focus:border-primary focus:ring-primary/10 transition-all font-medium placeholder:text-gray-300" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center mb-0.5">
                                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">password sirta ah</Label>
                                <Link href="#" className="text-[10px] font-bold text-primary hover:underline">Ma ilowday?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input id="password" name="password" type="password" required className="pl-9 h-11 rounded-lg bg-white border-gray-200 focus:border-primary focus:ring-primary/10 transition-all placeholder:text-gray-300" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-xs font-semibold animate-in fade-in zoom-in-95">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-4">
                        <Button className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-sm font-bold shadow-lg shadow-primary/20 transition-all" disabled={isLoading}>
                            {isLoading ? "Soo galaya..." : "Soo Gal"}
                        </Button>
                        <p className="text-center text-xs text-gray-500 font-medium">
                            Ma Lehi akoon hore?{" "}
                            <Link href="/register" className="text-primary hover:underline font-bold">
                                Is-diiwaangeli
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
