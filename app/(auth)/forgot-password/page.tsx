"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const phone = formData.get("phone") as string;

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                toast.success("Haddii lambarkaas uu jiro, xiriiriye ayaan kuu soo dirnay.");
            } else {
                setError("Khalad ayaa dhacay. Fadlan mar kale isku day.");
            }
        } catch (err) {
            setError("Xiriirka server-ka ayaa go'an.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="w-full max-w-lg mx-auto py-12">
                <Card className="border border-gray-100 shadow-xl shadow-gray-200/20 bg-white dark:bg-slate-900 dark:border-gray-800 overflow-hidden rounded-2xl p-8 text-center animate-in fade-in zoom-in-95">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-black mb-2 text-gray-900 dark:text-white">Hubi Taleefankaaga</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                        Haddii akoon uu ku jiro lambarkaas, waxaan kuu soo dirnay SMS aad password-ka ku bedelan karto.
                    </CardDescription>
                    <Link href="/login" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft className="h-4 w-4" />
                        Dib u laabo Login
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Miyaad ilowday Password-ka?</h1>
                <p className="text-sm text-gray-400 font-medium">Gali lambarka taleefankaaga si aan kuu soo dirno SMS aad password-ka ku bedelato.</p>
            </div>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-black/20 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
                <div className="h-1.5 bg-gradient-to-r from-primary to-blue-600" />
                <form onSubmit={onSubmit}>
                    <CardContent className="px-6 py-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-0.5">Lambarka Taleefanka</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input id="phone" name="phone" type="tel" placeholder="+252 6XXXXXX" required className="pl-9 h-11 rounded-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/10 transition-all font-medium placeholder:text-gray-300 dark:text-white" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-semibold">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="px-6 pb-8 flex flex-col gap-4">
                        <Button className="w-full h-11 rounded-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all" disabled={isLoading}>
                            {isLoading ? "Diraya..." : "Soo dir SMS"}
                        </Button>
                        <Link href="/login" className="text-center text-xs text-gray-500 font-medium hover:text-primary transition-colors">
                            Dib ugu laabo Login
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

