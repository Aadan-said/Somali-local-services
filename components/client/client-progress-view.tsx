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
        <Card className="p-8 bg-card/60 backdrop-blur-xl border-0 ring-1 ring-border shadow-xl shadow-foreground/5 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-black text-foreground text-lg uppercase tracking-tight">Horumarka Shaqada</h3>
            </div>

            <div className="space-y-6">
                {/* Progress Bar */}
                {parsedTasks.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Heerka Gebogebada</span>
                            <span className="font-black text-primary text-lg">{progressPercentage}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden ring-1 ring-border/50">
                            <div
                                className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500 transition-all duration-500 shadow-lg"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            {completedTasks} ka mid ah {parsedTasks.length} shaqo ayaa dhammaatay
                        </p>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Tasks */}
                    {parsedTasks.length > 0 && (
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shaqooyinka</span>
                            </div>
                            <p className="text-2xl font-black text-foreground tabular-nums">
                                {completedTasks}/{parsedTasks.length}
                            </p>
                        </div>
                    )}

                    {/* Time Spent */}
                    {totalHours > 0 && (
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Waqtiga</span>
                            </div>
                            <p className="text-2xl font-black text-foreground tabular-nums">
                                {totalHours.toFixed(1)} <span className="text-sm text-muted-foreground font-medium">saac</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Provider Notes */}
                {notes && (
                    <div className="bg-muted/30 rounded-2xl p-5 border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Faallooyinka Adeeg-bixiyaha</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                            {notes}
                        </p>
                    </div>
                )}

                {/* Status Badge */}
                {isActive && (
                    <div className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border shadow-sm ${progressPercentage >= 100
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-emerald-500/10 border-emerald-500/20"
                        }`}>
                        <div className={`h-2 w-2 rounded-full shadow-lg ${progressPercentage >= 100
                                ? "bg-emerald-500 shadow-emerald-500/50"
                                : "bg-emerald-500 animate-pulse shadow-emerald-500/50"
                            }`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${progressPercentage >= 100
                                ? "text-emerald-500"
                                : "text-emerald-500"
                            }`}>
                            {progressPercentage >= 100 ? "Shaqadii waa dhamaatay" : "Shaqadu way socotaa"}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}

