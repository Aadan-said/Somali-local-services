"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    currentImage?: string | null;
    onUploadSuccess?: (newImageUrl: string) => void;
    className?: string;
}

export function ImageUpload({ currentImage, onUploadSuccess, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Fadlan soo gali sawir kaaga .");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Sawirku waa inuu ka yaryahay 2MB.");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        try {
            const base64Image = await toBase64(file);
            const res = await fetch("/api/user/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(data.message);
                if (onUploadSuccess) onUploadSuccess(data.image);
            } else {
                toast.error("Waan ka xunnahay, sorry muuqaalkagii (profile) laguma uusan cusubaysiinin");
            }
        } catch (error) {
            toast.error("Cillad farsamo ayaa dhacday.");
        } finally {
            setIsUploading(false);
        }
    };

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("relative group cursor-pointer", className)} onClick={triggerFileInput}>
            <div className="relative aspect-square h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-xl ring-1 ring-gray-100 group-hover:ring-blue-400 group-hover:scale-[1.02] transition-all flex items-center justify-center">
                {preview ? (
                    <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <User className="h-10 w-10 text-gray-300" />
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                        <Camera className="h-6 w-6 text-white" />
                    )}
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                <Camera className="h-3 w-3" />
            </div>
        </div>
    );
}

