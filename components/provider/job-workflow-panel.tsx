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
    onSuccess?: () => void;
}

export function JobWorkflowPanel({ jobId, timeStarted, totalHours, onSuccess }: JobWorkflowPanelProps) {
    return (
        <div className="bg-linear-to-br from-purple-50/50 to-blue-50/50 rounded-2xl p-6 border border-purple-100/50 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-purple-100">
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Job Workflow</h2>
                    <p className="text-xs text-gray-500">Manage your work efficiently</p>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <TaskChecklist jobId={jobId} />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <TimeTracker
                            jobId={jobId}
                            initialTimeStarted={timeStarted}
                            initialTotalHours={totalHours}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <JobNotes jobId={jobId} />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="space-y-3">
                            <h3 className="font-bold text-gray-900">Proof of Work</h3>
                            <ProofUpload jobId={jobId} onSuccess={onSuccess} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
