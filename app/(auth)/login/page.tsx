"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, User as UserIcon, Briefcase, Eye, EyeOff, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";
import { useEffect } from "react";

import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");
    const [role, setRole] = useState<"client" | "provider">("client");
    // const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone"); // REMOVED
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        let identifier = formData.get("identifier") as string;
        identifier = identifier.trim();
        identifier = identifier.trim();

        // Phone Normalization Logic
        const isEmail = identifier.includes("@");
        if (!isEmail) {
            // Remove spaces and non-digit characters (except +)
            identifier = identifier.replace(/\s+/g, "");

            // Check if it's a local number starting with '0' or '6'
            // If it starts with '0', remove it.
            if (identifier.startsWith("0")) {
                identifier = identifier.substring(1);
            }

            // If it doesn't verify +252, add it
            if (!identifier.startsWith("+")) {
                identifier = "+252" + identifier;
            }
        }

        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                identifier,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Lambarka ama password-ka ayaa khaldan");
            } else {
                // Hubi session-ka cusub
                const response = await fetch("/api/auth/session");
                const session = await response.json();

                console.log("LOGIN_DEBUG: Session User Role ->", session?.user?.role);

                // LOGIC: Haddii uu yahay Admin, iska indha tir (ignore) dhibicda Role-ka
                // ee login-ka yaala, oo toos ugu gee Admin Profile.

                // Si loo hubiyo in browser-ka (gaar ahaan Chrome) uu helay cookies-ka,
                // waxaan sameynaynaa refresh yar iyo redirect toosan.
                router.refresh();

                setTimeout(() => {
                    if (session?.user?.role === "ADMIN") {
                        router.push("/admin");
                    } else {
                        // Haddii kale, u gee siday markii hore ahayd (Client ama Provider)
                        router.push(role === "client" ? "/client" : "/provider");
                    }
                }, 100);
            }
        } catch (err) {
            setError("Khalad ayaa dhacay. Fadlan mar kale isku day.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
            <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600" />

            <CardHeader className="pt-6 px-6">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Welcome Back</CardTitle>
                <CardDescription className="text-xs text-gray-400">Gali macluumaadkaaga hoos ku qoran</CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
                <CardContent className="px-6 py-4 space-y-5">
                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => setRole("client")}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                                role === "client"
                                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                                    : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
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
                                    : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            <Briefcase className="h-3.5 w-3.5" />
                            Adeeg-bixiye
                        </button>
                    </div>

                    {/* Unified Input - Email or Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="identifier" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">
                            Email ama Taleefan
                        </Label>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                id="identifier"
                                name="identifier"
                                type="text"
                                placeholder="name@example.com ama 61xxxxxxx"
                                required
                                autoCapitalize="none"
                                autoComplete="username"
                                className="pl-9 h-10 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all font-medium placeholder:text-gray-300 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center mb-0.5">
                            <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">password sirta ah</Label>
                            <Link href="/forgot-password" className="text-[10px] font-bold text-primary hover:underline">Ma ilowday?</Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="pl-9 pr-10 h-11 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary transition-colors z-10 cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-semibold animate-in fade-in zoom-in-95">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-4">
                    <Button className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-sm font-bold shadow-lg shadow-primary/20 transition-all" disabled={isLoading}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                Soo gelaya...
                            </span>
                        ) : "Soo Gal"}
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
    );
}

export default function LoginPage() {
    return (
        <div className="w-full max-w-lg mx-auto py-4">
            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-3 ring-4 ring-primary/5">
                    <LogIn className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
                <p className="text-sm text-gray-400 font-medium tracking-tight">Soo laabo si aad u maamusho shaqooyinkaaga</p>
            </div>

            <Suspense fallback={
                <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl h-[500px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </Card>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}

