"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface JobStatusButtonProps {
    jobId: string;
    initialStatus: string;
}

export function JobStatusButton({ jobId, initialStatus }: JobStatusButtonProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/jobs/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId, status: "COMPLETED" }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("COMPLETED");
                router.refresh();
            } else {
                setError(data.error || "Failed to update job status");
            }
        } catch (error) {
            console.error("Failed to update job status", error);
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "COMPLETED") {
        return (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xs bg-green-50 py-2 rounded-lg border border-green-100 w-full animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="h-4 w-4" />
                Job Completed
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full h-10 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95 shadow-sm flex items-center justify-center disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    "Mark as Completed"
                )}
            </button>
            {error && (
                <div className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-2 py-1.5 rounded border border-red-100">
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
