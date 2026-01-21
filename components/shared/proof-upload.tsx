"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProofUploadProps {
    jobId: string;
    onSuccess?: () => void;
    disabled?: boolean;
    progressPercentage?: number;
}

export function ProofUpload({ jobId, onSuccess, disabled = false, progressPercentage = 0 }: ProofUploadProps) {
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleUpload = async () => {
        if (!note && !imagePreview) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/provider/jobs/${jobId}/proof`, {
                method: "POST",
                body: JSON.stringify({
                    proofOfWorkNote: note,
                    proofOfWork: imagePreview || ""
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setOpen(false);
                setNote("");
                setImagePreview(null);
                setImageFile(null);
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error(data.error || "Failed to upload proof");
            }
        } catch (error) {
            console.error("Error uploading proof:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const isCompleted = progressPercentage >= 100;

    return (
        <Dialog open={open} onOpenChange={(val) => !disabled && setOpen(val)}>
            <DialogTrigger asChild>
                <Button
                    disabled={disabled}
                    className={cn(
                        "w-full h-12 rounded-xl font-black transition-all border-0 text-xs uppercase tracking-widest",
                        disabled
                            ? isCompleted
                                ? "bg-emerald-500/10 text-emerald-500 cursor-default ring-1 ring-emerald-500/20"
                                : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-70"
                            : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] text-white"
                    )}
                >
                    {disabled ? (
                        isCompleted ? (
                            <>
                                <ShieldCheck className="h-5 w-5 mr-2" />
                                Shaqadii waa dhamaatay
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="h-5 w-5 mr-2 opacity-50" />
                                Dhameystir {progressPercentage}%
                            </>
                        )
                    ) : (
                        <>
                            <ShieldCheck className="h-5 w-5 mr-2" />
                            Gali cadaynta shaqada
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto rounded-3xl border-0 p-0 shadow-2xl">
                {/* Decorative Background */}
                <div className="absolute inset-0 z-0 bg-gray-50/50" />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-500/10 to-transparent z-0" />

                <div className="relative z-10 p-6 space-y-6">
                    <DialogHeader className="text-center space-y-3 pt-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center ring-8 ring-white shadow-xl">
                            <ShieldCheck className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Gali Cadaynta Shaqada</DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                Tus macmiilkaaga in shaqada si hufan loo qabtay.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-5">
                        {/* Image Upload Area */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sawirka Cadaynta</label>
                                {imagePreview && (
                                    <button onClick={removeImage} className="text-[10px] font-bold text-red-500 hover:underline">Ka saar</button>
                                )}
                            </div>

                            {imagePreview ? (
                                <div className="relative group rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200 bg-white">
                                    <img
                                        src={imagePreview}
                                        alt="Proof preview"
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" size="sm" onClick={removeImage} className="font-bold">
                                            Bedel Sawirka
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 hover:border-green-500 bg-white hover:bg-green-50/30 rounded-2xl cursor-pointer transition-all group relative overflow-hidden">
                                    {/* Animated background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-full group-hover:-translate-y-full duration-1000" />

                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center space-y-3 relative z-10 transition-transform group-hover:scale-105 duration-300">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-green-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-700 group-hover:text-green-700">
                                                Riix si aad sawirka u soo geliso
                                            </p>
                                            <p className="text-xs text-gray-400 group-hover:text-green-600/70">
                                                Waxaad isticmaali kartaa JPG, PNG (Max 10MB)
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Notes Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                                Sharaxaadda Shaqada
                            </label>
                            <Textarea
                                placeholder="Qor sharaxaad kooban oo ku saabsan shaqada aad dhammaystirtay..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="min-h-[100px] rounded-xl border-gray-200 bg-white focus:ring-green-500/20 focus:border-green-500 transition-all resize-none shadow-sm text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="flex-1 rounded-xl h-12 text-sm font-bold border-gray-200 hover:bg-gray-50">
                                Iska daa
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleUpload}
                            disabled={loading || (!note && !imagePreview)}
                            className="flex-2 rounded-xl h-12 text-sm font-bold bg-gray-900 hover:bg-gray-800 text-white shadow-xl shadow-gray-200 hover:shadow-gray-300 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Dhammaystir oo Dir
                                    <ShieldCheck className="h-4 w-4 ml-2 text-green-400" />
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

