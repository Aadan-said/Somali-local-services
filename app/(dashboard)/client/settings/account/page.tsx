"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Trash2, UserX, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AccountPage() {
    const router = useRouter();
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeactivate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/account/deactivate", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                setShowDeactivateDialog(false);
                // Sign out user
                await signOut({ callbackUrl: "/login" });
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error deactivating account:", error);
            alert("Khalad ayaa dhacay!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletePassword) {
            alert("Fadlan geli password-kaaga!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/account/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                setShowDeleteDialog(false);
                // Sign out user
                await signOut({ callbackUrl: "/login" });
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Khalad ayaa dhacay!");
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Account Management</h1>
                    <p className="text-gray-500">Maamul account-kaaga</p>
                </div>
            </div>

            {/* Deactivate Account */}
            <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                                <UserX className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-gray-900">Jooji Account-ka</h3>
                                <p className="text-sm text-gray-600">
                                    Account-kaaga waa la joojin doonaa, laakiin waxaad dib u soo celin kartaa mar kale.
                                    Macluumaadkaaga oo dhan waa la keydin doonaa.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeactivateDialog(true)}
                            className="h-12 px-6 font-bold rounded-xl border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                        >
                            Jooji Account-ka
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-red-100 text-red-600">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-gray-900">Tirtir Account-ka</h3>
                                <p className="text-sm text-gray-600">
                                    <span className="font-bold text-red-600">Digniin:</span> Markii aad account-kaaga
                                    tirtirto, wax dib u soo celin ah ma jirto. Dhammaan macluumaadkaaga waa la tirtiri
                                    doonaa si joogto ah.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            className="h-12 px-6 font-bold rounded-xl shadow-lg shadow-red-500/20"
                        >
                            Tirtir Account-ka
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Deactivate Dialog */}
            <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-2xl">Jooji Account-ka?</DialogTitle>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            Ma hubtaa inaad rabto inaad joojiso account-kaaga? Waxaad dib u soo celin kartaa mar kale
                            markaad login gareysato.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeactivateDialog(false)}
                            className="rounded-xl"
                        >
                            Jooji
                        </Button>
                        <Button
                            onClick={handleDeactivate}
                            disabled={loading}
                            className="rounded-xl bg-yellow-600 hover:bg-yellow-700"
                        >
                            {loading ? "Joojinaya..." : "Haa, Jooji"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-xl bg-red-100 text-red-600">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-2xl">Tirtir Account-ka?</DialogTitle>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            <span className="font-bold text-red-600">Digniin Muhiim ah:</span> Tani waa tallaabo aan
                            dib u soo celin karin. Dhammaan macluumaadkaaga, codsiyada, iyo taariikhda waa la tirtiri
                            doonaa si joogto ah.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                        <Label htmlFor="deletePassword">Geli Password-kaaga si aad u xaqiijiso</Label>
                        <Input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Password-kaaga"
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setDeletePassword("");
                            }}
                            className="rounded-xl"
                        >
                            Jooji
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading || !deletePassword}
                            className="rounded-xl shadow-lg shadow-red-500/20"
                        >
                            {loading ? "Tirtirayaa..." : "Haa, Tirtir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
