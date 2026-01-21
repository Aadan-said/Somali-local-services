"use client";

import { TaskChecklist } from "./task-checklist";
import { TimeTracker } from "./time-tracker";
import { JobNotes } from "./job-notes";
import { ProofUpload } from "../shared/proof-upload";
import { Briefcase } from "lucide-react";

interface JobWorkflowPanelProps {
    jobId: string;
    timeStarted?: string | null;
    totalHours?: number;
    progressPercentage?: number;
    onSuccess?: () => void;
}

export function JobWorkflowPanel({ jobId, timeStarted, totalHours, progressPercentage = 0, onSuccess }: JobWorkflowPanelProps) {
    return (
        <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-8 border-0 ring-1 ring-border shadow-xl shadow-foreground/5 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                    <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Horumarka Shaqada</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Maamul shaqadaada si hufan</p>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="bg-muted/30 rounded-2xl p-6 shadow-sm border border-border backdrop-blur-sm">
                        <TaskChecklist jobId={jobId} />
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-6 shadow-sm border border-border backdrop-blur-sm">
                        <TimeTracker
                            jobId={jobId}
                            initialTimeStarted={timeStarted}
                            initialTotalHours={totalHours}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-muted/30 rounded-2xl p-6 shadow-sm border border-border backdrop-blur-sm">
                        <JobNotes jobId={jobId} />
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-6 shadow-sm border border-border backdrop-blur-sm">
                        <div className="space-y-4">
                            <h3 className="font-black text-foreground text-sm uppercase tracking-tight">Cadaynta Shaqada</h3>
                            <ProofUpload
                                jobId={jobId}
                                onSuccess={onSuccess}
                                disabled={progressPercentage < 100}
                                progressPercentage={progressPercentage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
