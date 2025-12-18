"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Send, MapPin, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateRequestPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        category: "",
        description: "",
        location: "",
        serviceDate: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/requests/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/client");
                }, 2000);
            } else {
                alert("Failed to create request. Please try again.");
            }
        } catch (error) {
            console.error("Error creating request:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-gray-900">Request Dispatched!</h1>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                    Your request has been successfully saved and broadcasted to our provider network in Somalia.
                </p>
                <div className="pt-4 flex items-center justify-center gap-2 text-sm text-purple-600 font-bold">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting to your dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    href="/client"
                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-purple-600 transition-colors"
                >
                    <div className="p-2 rounded-md bg-white border border-gray-200 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Dashboard
                </Link>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Priority Request</span>
                </div>
            </div>

            <Card className="border border-gray-100 bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="px-10 pt-10 pb-6 text-center border-b border-gray-50 bg-gray-50/30">
                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">
                        What <span className="text-purple-600">help</span> do you need?
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 font-medium">
                        Fill out the details below to dispatch your request.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="px-10 py-8 space-y-6">
                        {/* Service Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Service Category</Label>
                            <select
                                id="category"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-11 bg-white border border-gray-200 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all text-sm font-medium"
                            >
                                <option value="">Select a service...</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Home Cleaning">Home Cleaning</option>
                                <option value="AC Repair">AC Repair</option>
                                <option value="Mechanic">Mechanic</option>
                                <option value="Tutoring">Tutoring</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the task..."
                                className="min-h-[120px] bg-white border border-gray-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all text-sm resize-none"
                                required
                            />
                        </div>

                        {/* Location & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Location</Label>
                                <div className="relative">
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Town, Neighborhood"
                                        required
                                        className="h-11 bg-white border border-gray-200 rounded-md pl-10 text-sm focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600"
                                    />
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="serviceDate" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Date</Label>
                                <div className="relative">
                                    <Input
                                        id="serviceDate"
                                        type="date"
                                        value={formData.serviceDate}
                                        onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                                        required
                                        className="h-11 bg-white border border-gray-200 rounded-md pl-10 text-sm focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600"
                                    />
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-10 pb-10 flex gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.back()}
                            className="w-1/3 h-11 rounded-md font-bold text-xs uppercase"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-bold text-xs uppercase shadow-md shadow-purple-500/20 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
