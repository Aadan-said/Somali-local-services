"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, User as UserIcon, Briefcase, Sparkles, Phone, Mail, Lock, UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";

import { Suspense } from "react";

function RegisterForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleParam = searchParams.get("role");
    const [role, setRole] = useState<"client" | "provider">(
        roleParam === "provider" ? "provider" : "client"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const firstName = formData.get("fname") as string;
        const lastName = formData.get("lname") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string; // This will now come from the hidden input in PhoneInput
        const password = formData.get("password") as string;

        // --- STRICT VALIDATION START ---

        // 1. Gmail Validation
        if (email && !email.toLowerCase().endsWith("@gmail.com")) {
            setError("Fadlan isticmaal Gmail sax ah (example@gmail.com).");
            setIsLoading(false);
            return;
        }

        // 2. Phone Validation (Somali format check)
        // Clean spaces and check length. Assuming +252 is 4 chars.
        // Valid: +252 61 555 5555 (13 chars approx) or +252615555555
        const cleanPhone = phone.replace(/\s/g, "");
        if (!cleanPhone.startsWith("+252")) {
            setError("Lambarka waa inuu ku bilaabmaa +252 (Somalia).");
            setIsLoading(false);
            return;
        }

        // Check local part digits (should be 9 digits usually: 61 555 5555)
        const localPart = cleanPhone.substring(4); // Remove +252
        if (!/^\d{7,9}$/.test(localPart)) {
            setError("Fadlan gali lambar sax ah (e.g. 615xxxxxx).");
            setIsLoading(false);
            return;
        }
        // --- STRICT VALIDATION END ---

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email,
                    phone,
                    password,
                    role: role === "client" ? "USER" : "PROVIDER",
                }),
            });

            if (!res.ok) {
                let data;
                try {
                    data = await res.json();
                } catch (err) {
                    throw new Error(`Server Error (${res.status}): Please check database connection.`);
                }
                throw new Error(data.error || "Something went wrong");
            }

            // Redirect with phone number for auto-filling
            router.push(`/login?phone=${encodeURIComponent(phone)}`);
            // window.location.href = "/login"; // Removed to use router for smoother transition
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
            <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600" />

            <CardHeader className="pt-6 px-6">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Is-diiwaangelin</CardTitle>
                <CardDescription className="text-xs text-gray-400">Fadlan buuxi xogtaada hoos ku qoran</CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
                <CardContent className="px-6 py-4 space-y-4">
                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => setRole("client")}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                                role === "client"
                                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                                    : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            <UserIcon className="h-3.5 w-3.5" />
                            I need a Service
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("provider")}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                                role === "provider"
                                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                                    : "text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                            )}
                        >
                            <Briefcase className="h-3.5 w-3.5" />
                            I offer a Service
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="fname" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">Magaca hore</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input id="fname" name="fname" placeholder="Maxamed" required className="pl-9 h-10 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all font-medium placeholder:text-gray-300 dark:text-white" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="lname" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">Magaca dambe</Label>
                            <Input id="lname" name="lname" placeholder="Ali" required className="h-10 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all font-medium placeholder:text-gray-300 dark:text-white" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">Gmail-kaaga</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input id="email" name="email" type="email" placeholder="m@gmail.com" required className="pl-9 h-10 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all font-medium placeholder:text-gray-300 dark:text-white" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">Lambarka Taleefanka</Label>
                        <PhoneInput
                            id="phone"
                            name="phone"
                            required
                            placeholder="61 555 5555"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">Password sirta ah</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="pl-9 pr-10 h-10 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:text-white"
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
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Loading...
                            </div>
                        ) : (
                            "Abuur Akoon"
                        )}
                    </Button>
                    <p className="text-center text-xs text-gray-500 font-medium">
                        Horey ma u lahayd akoon?{" "}
                        <Link href="/login" className="text-primary hover:underline font-bold">
                            Soo gal
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function RegisterPage() {
    return (
        <div className="w-full max-w-lg mx-auto py-2">
            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-3 ring-4 ring-primary/5">
                    <UserPlus className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Nagu soo Biir Somali Services</h1>
                <p className="text-sm text-gray-400 font-medium tracking-tight">Sameyso akoon cusub si aad u bilowdo</p>
            </div>

            <Suspense fallback={
                <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl h-[600px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </Card>
            }>
                <RegisterForm />
            </Suspense>
        </div>
    );
}

