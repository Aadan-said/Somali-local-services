"use client";

import { useState, useEffect } from "react";
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
        <div className="space-y-4">
            {/* Header with Progress */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-900">Task Checklist</h3>
                    <p className="text-xs text-gray-500">{completedCount} of {tasks.length} completed</p>
                </div>
                {saving && <Loader2 className="h-4 w-4 animate-spin text-purple-600" />}
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-linear-to-r from-purple-600 to-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                ) : tasks.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No tasks yet. Add one below!</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-lg border transition-all group",
                                task.completed
                                    ? "bg-green-50 border-green-200"
                                    : "bg-white border-gray-200 hover:border-purple-200"
                            )}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={cn(
                                    "h-5 w-5 rounded border-2 flex items-center justify-center transition-all shrink-0",
                                    task.completed
                                        ? "bg-green-500 border-green-500"
                                        : "border-gray-300 hover:border-purple-500"
                                )}
                            >
                                {task.completed && <Check className="h-3 w-3 text-white" />}
                            </button>
                            <span className={cn(
                                "flex-1 text-sm",
                                task.completed ? "line-through text-gray-500" : "text-gray-900"
                            )}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Task Input */}
            <div className="flex gap-2">
                <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    className="flex-1 text-sm"
                />
                <Button
                    onClick={addTask}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
