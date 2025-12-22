"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface TaskChecklistProps {
    jobId: string;
}

export function TaskChecklist({ jobId }: TaskChecklistProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchTasks();
    }, [jobId]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/provider/jobs/${jobId}/tasks`);
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveTasks = async (updatedTasks: Task[]) => {
        setSaving(true);
        try {
            await fetch(`/api/provider/jobs/${jobId}/tasks`, {
                method: "POST",
                body: JSON.stringify({ tasks: updatedTasks }),
            });
        } catch (error) {
            console.error("Error saving tasks:", error);
        } finally {
            setSaving(false);
            router.refresh();
        }
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        const updated = [...tasks, { id: Date.now().toString(), text: newTask, completed: false }];
        setTasks(updated);
        setNewTask("");
        saveTasks(updated);
    };

    const toggleTask = (id: string) => {
        const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setTasks(updated);
        saveTasks(updated);
    };

    const deleteTask = (id: string) => {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        saveTasks(updated);
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="space-y-5">
            {/* Header with Progress */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Task Checklist</h3>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{completedCount} of {tasks.length} completed</p>
                </div>
                <div className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                    <span className="text-xs font-black text-gray-700">{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className={cn(
                        "h-full transition-all duration-700 ease-out shadow-sm",
                        progress === 100 ? "bg-green-500" : "bg-linear-to-r from-purple-500 to-blue-500"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Add Task Input */}
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <Input
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTask()}
                        className="h-10 text-sm bg-gray-50 border-gray-100 focus:bg-white focus:border-purple-200 transition-colors pl-3 rounded-xl"
                    />
                </div>
                <Button
                    onClick={addTask}
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl bg-gray-900 hover:bg-black text-white shadow-md active:scale-95 transition-all"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            {/* Task List */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                        <p className="text-sm font-bold text-gray-400">No tasks yet</p>
                        <p className="text-xs text-gray-400">Add tasks to track your progress</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group hover:shadow-sm",
                                task.completed
                                    ? "bg-green-50/50 border-green-100/50"
                                    : "bg-white border-gray-100 hover:border-purple-100"
                            )}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={cn(
                                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 duration-300",
                                    task.completed
                                        ? "bg-green-500 border-green-500 rotate-0"
                                        : "border-gray-200 hover:border-purple-400 bg-white rotate-0"
                                )}
                            >
                                <Check className={cn(
                                    "h-3.5 w-3.5 text-white transition-all duration-300",
                                    task.completed ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                )} />
                            </button>
                            <span className={cn(
                                "flex-1 text-sm font-medium transition-colors duration-300",
                                task.completed ? "line-through text-gray-400" : "text-gray-700 group-hover:text-gray-900"
                            )}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                            >
                                <X className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
