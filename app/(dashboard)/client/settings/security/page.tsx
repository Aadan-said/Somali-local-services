"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("Password-ka cusub iyo xaqiijinta waa inay isku mid ahaadaan!");
            return;
        }

        if (passwords.newPassword.length < 6) {
            alert("Password-ka cusub waa inuu ka badan yahay 6 xaraf!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                setPasswords({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Khalad ayaa dhacay!");
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 6) return { strength: 33, label: "Daciif", color: "bg-red-500" };
        if (password.length < 10) return { strength: 66, label: "Dhexdhexaad", color: "bg-yellow-500" };
        return { strength: 100, label: "Adag", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength(passwords.newPassword);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/client/settings")}
                    className="rounded-xl"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Security</h1>
                    <p className="text-gray-500">Maamul password-kaaga iyo amniga account-kaaga</p>
                </div>
            </div>

            <Card className="border-gray-100 shadow-lg">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Bedel Password-ka</CardTitle>
                            <CardDescription>Hubso in password-ku yahay mid adag oo ammaan ah</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Password-ka Hadda</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwords.currentPassword}
                                    onChange={(e) =>
                                        setPasswords({ ...passwords, currentPassword: e.target.value })
                                    }
                                    className="pr-10 h-12 rounded-xl"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Password-ka Cusub</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwords.newPassword}
                                    onChange={(e) =>
                                        setPasswords({ ...passwords, newPassword: e.target.value })
                                    }
                                    className="pr-10 h-12 rounded-xl"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {passwords.newPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Xoogga Password-ka:</span>
                                        <span className={`font-bold ${passwordStrength.strength === 100 ? "text-green-600" :
                                                passwordStrength.strength === 66 ? "text-yellow-600" : "text-red-600"
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{ width: `${passwordStrength.strength}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xaqiiji Password-ka Cusub</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={passwords.confirmPassword}
                                    onChange={(e) =>
                                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                                    }
                                    className="pr-10 h-12 rounded-xl"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                                <p className="text-sm text-red-600">Passwords-yada ma isku mid aha</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-12 px-8 font-bold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20"
                            >
                                {loading ? "Beddelaya..." : "Bedel Password-ka"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
