"use client";

import { useState } from "react";
import { ShieldCheck, Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProofUploadProps {
    jobId: string;
    onSuccess?: () => void;
}

export function ProofUpload({ jobId, onSuccess }: ProofUploadProps) {
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

            if (res.ok) {
                setOpen(false);
                setNote("");
                setImagePreview(null);
                setImageFile(null);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error("Error uploading proof:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all border-gray-100 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Submit Proof
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-green-400 to-emerald-600" />
                <DialogHeader className="pt-4 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-gray-900">Proof of Work</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Upload evidence of the completed service to verify with the client.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">
                            Upload Image
                        </label>

                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Proof preview"
                                    className="w-full h-48 object-cover rounded-2xl border-2 border-gray-200"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="h-10 w-10 text-gray-400 group-hover:text-green-500 mb-3" />
                                    <p className="text-sm font-bold text-gray-600 group-hover:text-green-600">
                                        Click to upload image
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
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

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">
                            Additional Notes
                        </label>
                        <Textarea
                            placeholder="Describe what was done or provide instructions for the client..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all resize-none text-sm"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleUpload}
                        disabled={loading || (!note && !imagePreview)}
                        className="w-full rounded-full h-12 text-md font-bold bg-linear-to-br from-green-500 to-emerald-600 hover:scale-[1.02] transition-transform shadow-lg shadow-green-100"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <ShieldCheck className="h-5 w-5 mr-2" />
                                Complete & Submit Proof
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
