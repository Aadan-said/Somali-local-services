"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Save, CheckCircle2, Briefcase, MapPin } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ProviderProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        city: "",
        bio: "",
        image: "" as string | null,
    });

    useEffect(() => {
        const fetchProviderData = async () => {
            if (session?.user) {
                try {
                    const response = await fetch("/api/provider/me");
                    if (response.ok) {
                        const data = await response.json();
                        setFormData({
                            name: session.user.name || "",
                            category: data.category || "",
                            city: data.city || "",
                            bio: data.bio || "",
                            image: data.user?.image || "",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch provider details", error);
                }
            }
        };

        fetchProviderData();
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch("/api/provider/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                // Update the session for Name change
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
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Provider Profile</h1>
                <p className="text-gray-500">How clients see you and your business in Somalia.</p>
            </div>

            <Card className="border-gray-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-linear-to-r from-blue-600 to-purple-600" />
                <div className="px-8 -mt-12 pb-8">
                    <div className="relative inline-block">
                        <ImageUpload
                            currentImage={formData.image}
                            onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                            className="ring-4 ring-white shadow-xl rounded-2xl"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name" className="text-sm font-bold text-gray-700">Display Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 border-gray-100 bg-gray-50/50"
                                    placeholder="Enter your name or business name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-bold text-gray-700">Service Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="h-12 border-gray-100 bg-gray-50/50">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electrician">Electrician</SelectItem>
                                        <SelectItem value="Plumber">Plumber</SelectItem>
                                        <SelectItem value="Home Cleaning">Home Cleaning</SelectItem>
                                        <SelectItem value="AC Repair">AC Repair</SelectItem>
                                        <SelectItem value="Mechanic">Mechanic</SelectItem>
                                        <SelectItem value="Tutoring">Tutoring</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-sm font-bold text-gray-700">Service City</Label>
                                <Select
                                    value={formData.city}
                                    onValueChange={(val: any) => setFormData({ ...formData, city: val })}
                                >
                                    <SelectTrigger className="h-12 border-gray-100 bg-gray-50/50">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mogadishu">Mogadishu</SelectItem>
                                        <SelectItem value="Hargeisa">Hargeisa</SelectItem>
                                        <SelectItem value="Garowe">Garowe</SelectItem>
                                        <SelectItem value="Kismayo">Kismayo</SelectItem>
                                        <SelectItem value="Baidoa">Baidoa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="bio" className="text-sm font-bold text-gray-700">About (Bio)</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="min-h-[120px] border-gray-100 bg-gray-50/50"
                                    placeholder="Tell potential clients about your experience and services..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 px-8 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Profile
                                    </>
                                )}
                            </Button>

                            {success && (
                                <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-left-4">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="text-sm font-bold">Profile updated successfully!</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
