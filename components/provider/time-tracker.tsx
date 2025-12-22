"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeTrackerProps {
    jobId: string;
    initialTimeStarted?: string | null;
    initialTotalHours?: number;
}

export function TimeTracker({ jobId, initialTimeStarted, initialTotalHours = 0 }: TimeTrackerProps) {
    const [isRunning, setIsRunning] = useState(!!initialTimeStarted);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [totalHours, setTotalHours] = useState(initialTotalHours);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isRunning && initialTimeStarted) {
            const startTime = new Date(initialTimeStarted).getTime();
            const interval = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                setElapsedSeconds(elapsed);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, initialTimeStarted]);

    const handleStart = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/provider/jobs/${jobId}/time`, {
                method: "POST",
                body: JSON.stringify({ action: "start" }),
            });
            if (res.ok) {
                setIsRunning(true);
                setElapsedSeconds(0);
            }
        } catch (error) {
            console.error("Error starting timer:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/provider/jobs/${jobId}/time`, {
                method: "POST",
                body: JSON.stringify({ action: "stop" }),
            });
            if (res.ok) {
                const data = await res.json();
                setIsRunning(false);
                setTotalHours(data.totalHours);
                setElapsedSeconds(0);
            }
        } catch (error) {
            console.error("Error stopping timer:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 rounded-lg">
                        <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">Time Tracker</h3>
                        <p className="text-[10px] text-gray-400 font-medium">Track your billable hours</p>
                    </div>
                </div>
                {isRunning && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-full border border-red-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Live</span>
                    </div>
                )}
            </div>

            {/* Timer Display */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />

                <div className="relative z-10 space-y-1">
                    <div className={cn(
                        "text-5xl font-black font-mono tracking-widest transition-colors duration-300",
                        isRunning ? "text-white" : "text-gray-400"
                    )}>
                        {isRunning ? formatTime(elapsedSeconds) : "00:00:00"}
                    </div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        {isRunning ? "Recording Time..." : "Ready to Start"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Total Hours */}
                <div className="flex flex-col justify-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Total Hours</span>
                    <span className="text-lg font-black text-gray-900">{totalHours.toFixed(2)} hrs</span>
                </div>

                {/* Controls */}
                <div className="flex">
                    {!isRunning ? (
                        <Button
                            onClick={handleStart}
                            disabled={loading}
                            className="w-full h-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-md shadow-green-100 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <div className="flex items-center gap-2">
                                    <Play className="h-4 w-4 fill-current" />
                                    <span>Start</span>
                                </div>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleStop}
                            disabled={loading}
                            className="w-full h-full rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-md shadow-red-100 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <div className="flex items-center gap-2">
                                    <Pause className="h-4 w-4 fill-current" />
                                    <span>Stop</span>
                                </div>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
