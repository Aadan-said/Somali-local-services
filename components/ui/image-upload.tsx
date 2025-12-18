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
            toast.error("Fadlan soo gali sawir sax ah.");
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
                toast.error("Wuu dhib ku yimid soo galinta sawirka.");
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
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 group-hover:border-blue-400 transition-all flex items-center justify-center shadow-inner">
                {preview ? (
                    <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                    <User className="h-10 w-10 text-gray-300" />
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
