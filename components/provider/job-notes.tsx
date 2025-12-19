"use client";

import { useState, useEffect } from "react";
import { FileText, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JobNotesProps {
    jobId: string;
}

export function JobNotes({ jobId }: JobNotesProps) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        fetchNotes();
    }, [jobId]);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`/api/provider/jobs/${jobId}/notes`);
            const data = await res.json();
            setNotes(data.notes || "");
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveNotes = async () => {
        setSaving(true);
        try {
            await fetch(`/api/provider/jobs/${jobId}/notes`, {
                method: "POST",
                body: JSON.stringify({ notes }),
            });
            setLastSaved(new Date());
        } catch (error) {
            console.error("Error saving notes:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <h3 className="font-bold text-gray-900">Job Notes</h3>
                </div>
                {lastSaved && (
                    <span className="text-xs text-gray-400">
                        Saved {lastSaved.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
            ) : (
                <>
                    <Textarea
                        placeholder="Add notes about this job... (e.g., special instructions, materials needed, progress updates)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[120px] resize-none text-sm"
                    />
                    <Button
                        onClick={saveNotes}
                        disabled={saving}
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Notes
                    </Button>
                </>
            )}
        </div>
    );
}
