"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!token) {
        return (
            <Card className="border-red-100 bg-red-50/50">
                <CardContent className="pt-6 text-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-red-900 mb-2">Xiriiriye Khaldan</h2>
                    <p className="text-sm text-red-600 mb-6">Token-ka password reset-ka waa mid dhacay ama khaldan.</p>
                    <Button onClick={() => router.push("/forgot-password")} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                        Codso mid cusub
                    </Button>
                </CardContent>
            </Card>
        );
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Password-yadu iskuma mid ma aha.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast.success("Password-ka si guul leh ayaa loo bedelay.");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                const data = await response.json();
                setError(data.error || "Khalad ayaa dhacay.");
            }
        } catch (err) {
            setError("Xiriirka server-ka ayaa go'an.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <Card className="border-green-100 bg-green-50/30 text-center p-8 scale-100 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-black text-green-900 mb-2">Guul!</CardTitle>
                <CardDescription className="text-green-700 text-sm mb-6">
                    Password-kaagii si guul leh ayaa loo bedelay. Hadda waad gali kartaa barnaamijka.
                </CardDescription>
                <p className="text-xs text-green-600 font-medium">Waxa laguu wareejinayaa login-ka...</p>
            </Card>
        );
    }

    return (
        <Card className="border border-gray-100 shadow-xl shadow-gray-200/20 bg-white overflow-hidden rounded-2xl">
            <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600" />
            <CardHeader className="px-6 pt-8">
                <CardTitle className="text-xl font-black">Bedel Password-ka</CardTitle>
                <CardDescription>Fadlan geli password cusub oo adag.</CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="px-6 py-4 space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase text-gray-400">Password Cusub</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-300 transition-colors" />
                            </div>
                            <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="pl-9 pr-10 h-11 rounded-lg"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase text-gray-400">Xaqiiji Password-ka</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-300 transition-colors" />
                            </div>
                            <Input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                className="pl-9 h-11 rounded-lg"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-xs font-semibold">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="px-6 pb-8 pt-4">
                    <Button className="w-full h-11 rounded-lg font-bold" disabled={isLoading}>
                        {isLoading ? "Bedelaya..." : "Cusboonaysii Password-ka"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="w-full max-w-lg mx-auto py-12">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}

