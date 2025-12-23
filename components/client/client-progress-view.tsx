"use client";

import { CheckCircle2, Clock, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ClientProgressViewProps {
    tasks?: string | null;
    progressPercentage?: number;
    totalHours?: number;
    notes?: string | null;
    timeStarted?: string | null;
}

export function ClientProgressView({
    tasks,
    progressPercentage = 0,
    totalHours = 0,
    notes,
    timeStarted
}: ClientProgressViewProps) {
    const parsedTasks = tasks ? JSON.parse(tasks) : [];
    const completedTasks = parsedTasks.filter((t: any) => t.completed).length;
    const isActive = !!timeStarted;

    if (!isActive && parsedTasks.length === 0 && !notes) {
        return null; // Don't show if no workflow data
    }

    return (
        <Card className="p-6 bg-linear-to-br from-blue-50/50 to-purple-50/50 border-blue-100">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Horumarka Shaqada</h3>
            </div>

            <div className="space-y-4">
                {/* Progress Bar */}
                {parsedTasks.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Heerka Gebogebada</span>
                            <span className="font-bold text-blue-600">{progressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            {completedTasks} ka mid ah {parsedTasks.length} shaqo ayaa dhammaatay
                        </p>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Tasks */}
                    {parsedTasks.length > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-bold text-gray-500">Shaqooyinka</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                                {completedTasks}/{parsedTasks.length}
                            </p>
                        </div>
                    )}

                    {/* Time Spent */}
                    {totalHours > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-bold text-gray-500">Waqtiga la adeegsaday</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                                {totalHours.toFixed(1)} saac
                            </p>
                        </div>
                    )}
                </div>

                {/* Provider Notes */}
                {notes && (
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-bold text-gray-500">Faallooyinka Adeeg-bixiyaha</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {notes}
                        </p>
                    </div>
                )}

                {/* Status Badge */}
                {isActive && (
                    <div className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-green-700">Shaqadu way socotaa</span>
                    </div>
                )}
            </div>
        </Card>
    );
}
