"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Time Tracker</h3>
                <Clock className="h-4 w-4 text-gray-400" />
            </div>

            {/* Timer Display */}
            <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-xl p-6 text-center border border-purple-100">
                <div className="text-4xl font-bold text-gray-900 font-mono tracking-wider">
                    {isRunning ? formatTime(elapsedSeconds) : "00:00:00"}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {isRunning ? "Timer Running" : "Timer Stopped"}
                </p>
            </div>

            {/* Total Hours */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Hours Worked</span>
                <span className="text-sm font-bold text-gray-900">{totalHours.toFixed(2)} hrs</span>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                {!isRunning ? (
                    <Button
                        onClick={handleStart}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        Start Timer
                    </Button>
                ) : (
                    <Button
                        onClick={handleStop}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4 mr-2" />}
                        Stop Timer
                    </Button>
                )}
            </div>
        </div>
    );
}
