"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobApplyButtonProps {
    jobId: string;
    hasApplied: boolean;
    jobStatus: string; // PENDING, COMPLETED, etc.
    isProvider: boolean; // Is the current user a provider?
}

export function JobApplyButton({ jobId, hasApplied, jobStatus, isProvider }: JobApplyButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const router = useRouter();

    const handleApply = async () => {
        if (!price) {
            toast.error("Fadlan geli qiimaha aad ku qabanayso shaqada");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/requests/${jobId}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    price: parseFloat(price),
                    coverLetter
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Dalabkaaga waa la gudbiyay! Macmiilka ayaa kula soo xiriiri doona.");
                setIsOpen(false);
                router.refresh(); // Refresh to update UI to "Applied" state
            } else {
                toast.error(data.error || "Waan ka xunnahay, cilad ayaa dhacday");
            }
        } catch (error) {
            toast.error("Cilad ayaa dhacday, fadlan isku day hadhow");
        } finally {
            setIsLoading(false);
        }
    };

    if (jobStatus !== "PENDING") {
        return (
            <Button disabled variant="outline" className="w-full opacity-50 cursor-not-allowed">
                Shaqadan waa xiirane
            </Button>
        );
    }

    if (!isProvider) {
        return (
            <Button onClick={() => router.push("/register?role=provider")} className="w-full">
                Is-diiwaangeli
            </Button>
        );
    }

    if (hasApplied) {
        return (
            <Button disabled className="w-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 cursor-not-allowed font-bold">
                Waad Dalbatay
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    Dalbo Shaqadan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Dalbo Shaqo</DialogTitle>
                    <DialogDescription>
                        Fadlan geli qiimaha aad ku qabanayso shaqadan iyo fariin kooban oo ku socota macmiilka.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Qiimaha (USD)</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="tus. 50"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="coverLetter">Fariin (Optional)</Label>
                        <Textarea
                            id="coverLetter"
                            placeholder="Waxaan ahay xirfadle khibrad u leh..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleApply} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Gudbi Dalabka
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
