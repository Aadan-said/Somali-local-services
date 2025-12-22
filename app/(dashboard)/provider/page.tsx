"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCcw, Bell, Briefcase, Star, DollarSign, MapPin, TrendingUp, Loader2, CheckCircle2, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

interface Stats {
    new_leads: number;
    active_jobs: number;
    earnings: string;
    rating: number;
}

interface MarketRequest {
    id: string;
    category: string;
    description: string;
    location: string;
    user: {
        name: string;
        phone?: string;
    };
    createdAt: string;
}

interface ProviderJob {
    id: string;
    category: string;
    description: string;
    location: string;
    status: string;
    user: {
        name: string;
        email: string;
        phone?: string;
    };
    createdAt: string;
}

export default function ProviderDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [leads, setLeads] = useState<MarketRequest[]>([]);
    const [myJobs, setMyJobs] = useState<ProviderJob[]>([]);
    const [activeTab, setActiveTab] = useState<"market" | "jobs">("market");
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, leadsRes, jobsRes] = await Promise.all([
                fetch("/api/provider/stats"),
                fetch("/api/provider/market"),
                fetch("/api/provider/jobs")
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (leadsRes.ok) setLeads(await leadsRes.json());
            if (jobsRes.ok) setMyJobs(await jobsRes.json());
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast.error("Wuu dhib ku yimid soo qabashada xogta");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (requestId: string) => {
        setIsAccepting(requestId);
        try {
            const res = await fetch(`/api/provider/requests/${requestId}/accept`, {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Codsigaaga waa la diray! Sug inta macmiilku ka aqbalayo.");
                // Update local state
                const acceptedLead = leads.find(l => l.id === requestId);
                if (acceptedLead) {
                    setLeads(leads.filter(l => l.id !== requestId));
                    // Add to jobs with updated status
                    setMyJobs([{ ...acceptedLead, status: "WAITING_APPROVAL", user: { ...acceptedLead.user, email: "" } } as ProviderJob, ...myJobs]);
                }
                // Refetch stats
                const statsRes = await fetch("/api/provider/stats");
                if (statsRes.ok) setStats(await statsRes.json());
            } else {
                toast.error("Waan ka xunnahay, shaqadan aqbalideeda cilad farsamo ayaa nagu hortaagan. Fadlan mar kale isku day.");
            }
        } catch (error) {
            toast.error("Ma suuroobin in nidaamku aqbalo hadda. Fadlan mar kale isku day.");
        } finally {
            setIsAccepting(null);
        }
    };

    const handleUpdateStatus = async (requestId: string, newStatus: string) => {
        setIsUpdatingStatus(requestId);
        try {
            const res = await fetch(`/api/provider/requests/${requestId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                toast.success(`Heerka shaqada waa la cusubaysiiyay: ${newStatus}`);
                setMyJobs(myJobs.map(job =>
                    job.id === requestId ? { ...job, status: newStatus } : job
                ));
                // Refetch stats for completion earnings
                if (newStatus === "COMPLETED") {
                    const statsRes = await fetch("/api/provider/stats");
                    if (statsRes.ok) setStats(await statsRes.json());
                }
            } else {
                toast.error("Waan ka xunnahay, cusubaysiinta heerka shaqadaan cilad ayaa ku timid. Fadlan mar kale isku day.");
            }
        } catch (error) {
            toast.error("Ma suuroobin in la cusubaysiiyo hadda. Fadlan mar kale isku day.");
        } finally {
            setIsUpdatingStatus(null);
        }
    };

    if (isLoading && !stats) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase tracking-wider">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Verified Professional</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Provider <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Network</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("market")}
                            className={cn(
                                "px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                activeTab === "market" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Market
                        </button>
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={cn(
                                "px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                activeTab === "jobs" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            My Jobs
                        </button>
                    </div>
                    <Button
                        onClick={fetchData}
                        disabled={isLoading}
                        variant="outline"
                        className="h-11 px-4 border-gray-100 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all group"
                    >
                        <RefreshCcw className={cn("h-4 w-4 transition-transform duration-500 text-blue-600", isLoading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Incoming Leads", value: leads.length, icon: Bell, color: "blue", action: () => setActiveTab("market") },
                    { label: "Active Duty", value: myJobs.filter(j => j.status !== "COMPLETED").length, icon: Briefcase, color: "indigo", action: () => setActiveTab("jobs") },
                    { label: "Reputation", value: stats?.rating ?? 0, icon: Star, color: "amber", action: () => { } },
                ].map((stat, i) => (
                    <div key={i} onClick={stat.action} className="cursor-pointer">
                        <Card className="group border border-gray-100 bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</CardTitle>
                                <div className={cn(
                                    "h-8 w-8 rounded-md flex items-center justify-center border shadow-xs",
                                    stat.color === "blue" ? "bg-blue-50 border-blue-100 text-blue-600" :
                                        stat.color === "indigo" ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                                            "bg-amber-50 border-amber-100 text-amber-600"
                                )}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-gray-900">
                                    {stat.value}
                                    {stat.label === "Reputation" && <span className="text-xs text-gray-400 tracking-normal ml-0.5">/ 5.0</span>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {/* Earnings Card */}
                <Card className="group border-none bg-linear-to-br from-blue-600 to-indigo-600 shadow-md rounded-lg overflow-hidden text-white hover:shadow-lg transition-all h-full">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-blue-50/80 font-bold text-[10px] uppercase tracking-widest">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">
                            {stats?.earnings.split('.')[0]}
                            <span className="text-lg opacity-60">.{stats?.earnings.split('.')[1] || '00'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Section */}
            <Card className="border border-gray-100 bg-white shadow-sm rounded-lg overflow-hidden">
                <CardHeader className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">
                        {activeTab === "market" ? "Live Market" : "Management Console"}
                    </CardTitle>
                    {activeTab === "market" && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 uppercase animate-pulse">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Live Updates
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-gray-50/50 border-gray-100">
                                <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500">Client</TableHead>
                                <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500">Service</TableHead>
                                <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500 hidden md:table-cell">
                                    {activeTab === "market" ? "Location" : "Status"}
                                </TableHead>
                                <TableHead className="px-6 py-4 text-right font-black text-[10px] uppercase tracking-widest text-gray-500">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeTab === "market" ? (
                                leads.length > 0 ? (
                                    leads.map((req) => (
                                        <TableRow key={req.id} className="group hover:bg-gray-50/80 transition-all duration-300 border-gray-50">
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                        <Star className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="font-black text-gray-900 tracking-tight">{req.user.name}</div>
                                                        <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                                            <Phone className="h-2.5 w-2.5" />
                                                            {req.user.phone || "No phone"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest border border-blue-100 shadow-xs">
                                                        {req.category}
                                                    </div>
                                                    <div className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-tighter">
                                                        New Lead
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100 w-fit">
                                                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                    {req.location}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <Button
                                                    onClick={() => handleAccept(req.id)}
                                                    disabled={isAccepting === req.id}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase px-5 py-5 shadow-md hover:shadow-lg transition-all active:scale-95"
                                                >
                                                    {isAccepting === req.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        "Request Job"
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                                <Briefcase className="h-8 w-8 opacity-20" />
                                                <p className="text-sm font-medium">Suuqa hadda wax codsi ah kuma jiraan qaybtada</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                myJobs.length > 0 ? (
                                    myJobs.map((job) => (
                                        <TableRow key={job.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{job.user.name}</div>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                        <Mail className="h-2.5 w-2.5" />
                                                        {job.user.email}
                                                    </div>
                                                    <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                                        <Phone className="h-2.5 w-2.5" />
                                                        {job.user.phone || "No phone"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100">
                                                    {job.category}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 hidden md:table-cell">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border",
                                                    job.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        job.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            job.status === "WAITING_APPROVAL" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                                "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {job.status.replace("_", " ")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {job.status === "WAITING_APPROVAL" && (
                                                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                                                            Waiting for Client
                                                        </span>
                                                    )}
                                                    {job.status === "ACCEPTED" && (
                                                        <Button
                                                            onClick={() => handleUpdateStatus(job.id, "IN_PROGRESS")}
                                                            disabled={isUpdatingStatus === job.id}
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-3 text-[9px] font-bold uppercase border-blue-200 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            Start Job
                                                        </Button>
                                                    )}
                                                    {job.status === "IN_PROGRESS" && (
                                                        <Button
                                                            onClick={() => handleUpdateStatus(job.id, "COMPLETED")}
                                                            disabled={isUpdatingStatus === job.id}
                                                            size="sm"
                                                            className="h-8 px-3 text-[9px] font-bold uppercase bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        >
                                                            Mark Done
                                                        </Button>
                                                    )}
                                                    {job.status === "COMPLETED" && (
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                                <Briefcase className="h-8 w-8 opacity-20" />
                                                <p className="text-sm font-medium">Wali wax shaqo ah kuma aadan qorin</p>
                                                <Button
                                                    variant="link"
                                                    className="text-blue-600 font-bold p-0 h-auto"
                                                    onClick={() => setActiveTab("market")}
                                                >
                                                    Guir suuqa (Market) si aad shaqo u hesho
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

