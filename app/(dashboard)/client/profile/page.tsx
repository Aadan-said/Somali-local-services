"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Save, CheckCircle2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ClientProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "" as string | null,
    });

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
            });
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                // Update the session to reflect changes
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                    },
                });
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 text-center md:text-left">Your Profile</h1>
                <p className="text-gray-500 text-center md:text-left">Manage your account information and how others see you.</p>
            </div>

            <Card className="border-gray-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-linear-to-r from-purple-600 to-blue-600" />
                <div className="px-8 -mt-12 pb-8">
                    <div className="relative inline-block">
                        <ImageUpload
                            currentImage={formData.image}
                            onUploadSuccess={async (url) => {
                                setFormData({ ...formData, image: url });
                                // Also update the session immediately
                                await update({
                                    ...session,
                                    user: {
                                        ...session?.user,
                                        image: url,
                                    },
                                });
                            }}
                            className="ring-4 ring-white shadow-xl rounded-2xl"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold text-gray-700">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="h-12 border-gray-100 bg-gray-100 cursor-not-allowed opacity-60"
                                    placeholder="Your email address"
                                />
                                <p className="text-[10px] text-gray-400 font-medium italic">Email cannot be changed directly for security reasons.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 px-8 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-left-4">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="text-sm font-bold">Profile updated!</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
