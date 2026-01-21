"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JobStatusButtonProps {
    jobId: string;
    initialStatus: string;
}

export function JobStatusButton({ jobId, initialStatus }: JobStatusButtonProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdate = async (nextStatus: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/provider/requests/${jobId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus(nextStatus);
                toast.success("Shaqada waa la bilaabay!");
                router.refresh();
            } else {
                const errorMsg = data.error || "Waan ka xunnahay, cusubaysiinta heerka shaqadaan cilad ayaa ku timid.";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Failed to update job status", error);
            const errorMsg = "Ma suuroobin in la cusubaysiiyo hadda. Fadlan internetka hubi.";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (status !== "ACCEPTED") return null;

    return (
        <div className="space-y-2">
            <button
                onClick={() => handleUpdate("IN_PROGRESS")}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                        <ShieldCheck className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        Bilow Shaqada
                    </>
                )}
            </button>
            {error && (
                <div className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-2 py-1.5 rounded border border-red-100">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

