"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCcw, Bell, Briefcase, Star, DollarSign, MapPin, TrendingUp, Loader2, CheckCircle2, Phone, Mail, Clock, ShieldCheck, User, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ProviderReviewsDialog } from "@/components/provider/provider-reviews-dialog";
import { cn } from "@/lib/utils";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string;
    };
    request?: {
        category: string;
    }
}

interface Stats {
    new_leads: number;
    active_jobs: number;
    earnings: string;
    balance: string;
    rating: number;
    reviews: Review[];
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
    // Workflow fields
    progressPercentage?: number;
    proofOfWork?: string;
}

export default function ProviderDashboard() {
    const router = useRouter();
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
            const [analyticsRes, leadsRes, jobsRes] = await Promise.all([
                fetch("/api/provider/analytics"),
                fetch("/api/provider/market"),
                fetch("/api/provider/jobs")
            ]);

            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setStats({
                    new_leads: 0, // Calculated client-side
                    active_jobs: 0, // Calculated client-side
                    earnings: data.stats.totalRevenue.toFixed(2),
                    balance: data.stats.currentBalance.toFixed(2),
                    rating: data.stats.rating,
                    reviews: data.reviews
                });
            }
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
                toast.success("Codsigaaga waa la diray! ee fadlan Sug inta macmiilku ka aqbalayo.");
                // Update local state
                const acceptedLead = leads.find(l => l.id === requestId);
                if (acceptedLead) {
                    setLeads(leads.filter(l => l.id !== requestId));
                    // Add to jobs with updated status
                    setMyJobs([{ ...acceptedLead, status: "WAITING_APPROVAL", user: { ...acceptedLead.user } } as ProviderJob, ...myJobs]);
                }
                // Refetch stats
                const analyticsRes = await fetch("/api/provider/analytics");
                if (analyticsRes.ok) {
                    const data = await analyticsRes.json();
                    setStats(prev => prev ? ({ ...prev, earnings: data.stats.totalRevenue.toFixed(2), balance: data.stats.currentBalance.toFixed(2) }) : null);
                }
            } else {
                toast.error("Waan ka xunnahay, sorry kuma uusan aqablin macmaiikani si aad shaqadaan uqabtid");
            }
        } catch (error) {
            toast.error("Ma suuroobin in nidaamku aqbalo hadda. Fadlan mar kale isku day.");
        } finally {
            setIsAccepting(null);
        }
    };



    const handleUpdateStatus = async (job: ProviderJob, newStatus: string) => {
        // Validation for COMPLETION
        if (newStatus === "COMPLETED") {
            router.push(`/provider/jobs`);
            toast.info("Fadlan dhamaystir workflow-ga oo soo gudbi sawirka shaqada.");
            return;
        }

        setIsUpdatingStatus(job.id);
        try {
            const res = await fetch(`/api/provider/requests/${job.id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                toast.success("Heerka shaqada waa la cusboonaysiiyay!");
                setMyJobs(myJobs.map(j =>
                    j.id === job.id ? { ...j, status: newStatus } : j
                ));
                // Refetch stats
                const analyticsRes = await fetch("/api/provider/analytics");
                if (analyticsRes.ok) {
                    const data = await analyticsRes.json();
                    setStats(prev => prev ? ({ ...prev, earnings: data.stats.totalRevenue.toFixed(2), balance: data.stats.currentBalance.toFixed(2) }) : null);
                }
            } else {
                toast.error("Waan ka xunnahay, cusubaysiinta heerka shaqadaan cilad ayaa ku timid.");
            }
        } catch (error) {
            toast.error("Ma suuroobin in la cusubaysiiyo hadda.");
        } finally {
            setIsUpdatingStatus(null);
        }
    };

    if (isLoading && !stats) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified Professional</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Provider <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-md">
                        Maamul shaqooyinkaaga, dakhligaaga, iyo codsiyada cusub ee suuqa.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <button
                            onClick={() => setActiveTab("market")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-xs font-bold transition-all",
                                activeTab === "market" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            Suuqa (Market)
                        </button>
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-xs font-bold transition-all",
                                activeTab === "jobs" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            Shaqooyinkayga
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* New Leads */}
                <Card
                    className="group border-0 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-4xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer ring-1 ring-white/60"
                    onClick={() => setActiveTab("market")}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Codsiyada Cusub</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Bell className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900 tabular-nums">
                            {leads.length}
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2">Available Leads</p>
                    </CardContent>
                </Card>

                {/* Active Jobs */}
                <Card
                    className="group border-0 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-4xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer ring-1 ring-white/60"
                    onClick={() => setActiveTab("jobs")}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Shaqooyinka Socda</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900 tabular-nums">
                            {myJobs.filter(j => j.status !== "COMPLETED").length}
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2">Active Tasks</p>
                    </CardContent>
                </Card>

                {/* Rating */}
                <ProviderReviewsDialog
                    reviews={stats?.reviews || []}
                    rating={stats?.rating || 0}
                    trigger={
                        <Card className="group border-0 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-4xl hover:shadow-2xl hover:-translate-y-1 transition-all ring-1 ring-white/60 cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Qiimaynta</CardTitle>
                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:rotate-12 transition-transform">
                                    <Star className="h-5 w-5 fill-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-900 tabular-nums flex items-end gap-1">
                                    {stats?.rating?.toFixed(1) ?? "0.0"}
                                    <span className="text-lg text-slate-400 mb-1">/5</span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 mt-2">Client Satisfaction</p>
                            </CardContent>
                        </Card>
                    }
                />
                {/* Earnings Card - CLICKABLE TO WALLET */}
                <Link href="/provider/wallet" className="block col-span-1 sm:col-span-2 lg:col-span-1">
                    <Card className="group relative border-0 bg-primary shadow-2xl shadow-primary/30 rounded-4xl overflow-hidden hover:scale-[1.02] transition-all duration-500 text-white h-full cursor-pointer">
                        {/* Background Patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                            <CardTitle className="text-white/80 font-black text-[10px] uppercase tracking-widest">Jeebka/Wallet</CardTitle>
                            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:rotate-12 transition-transform">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 pt-4">
                            <div className="text-4xl font-black leading-none tracking-tight">
                                ${stats?.balance || "0.00"}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-[10px] font-bold text-white/80 uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3" />
                                    <span>Balance</span>
                                </span>
                                <span className="text-white/60">Lifetime: ${stats?.earnings}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {activeTab === "market" ? "Suuqa Furan (Live Market)" : "Maamulka Shaqooyinka"}
                    </h2>
                    <Button
                        onClick={fetchData}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-wider shadow-sm"
                    >
                        <RefreshCcw className={cn("h-3.5 w-3.5 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                {activeTab === "market" ? (
                    <div className="grid gap-5">
                        {leads.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {leads.map((req) => (
                                    <div key={req.id} className="group relative bg-white/80 backdrop-blur-sm border border-white/50 p-6 rounded-[2rem] shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg border border-blue-100/50">
                                                    {req.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 leading-tight">{req.user.name}</h3>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {req.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                {req.category}
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-slate-600 mb-6 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                            "{req.description}"
                                        </p>

                                        <Button
                                            onClick={() => handleAccept(req.id)}
                                            disabled={isAccepting === req.id}
                                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                        >
                                            {isAccepting === req.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                "Diri Codsi (Request Job)"
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-300">
                                <div className="p-6 bg-white rounded-full shadow-lg shadow-slate-200 mb-4">
                                    <Clock className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Suuqa waa madhan yahay</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Hadda ma jiraan codsiyo cusub. Fadlan dib u eeg mar dhow.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {myJobs.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {myJobs.map((job) => (
                                    <div key={job.id} className="group relative bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-[2rem] shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">

                                        {/* Status Badge */}
                                        <div className="absolute top-6 right-6">
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border",
                                                job.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    job.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        job.status === "WAITING_APPROVAL" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                            "bg-amber-50 text-amber-600 border-amber-100"
                                            )}>
                                                {job.status.replace("_", " ")}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6 pr-24">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-lg shadow-inner">
                                                {job.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 leading-tight">{job.user.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{job.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                {job.user.phone || "Lama heli karo"}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            {job.status === "WAITING_APPROVAL" && (
                                                <div className="w-full py-4 text-center bg-purple-50/50 rounded-xl border border-purple-100/50 text-purple-600 text-xs font-black uppercase tracking-widest">
                                                    Sugitaanka Macmiilka...
                                                </div>
                                            )}
                                            {job.status === "ACCEPTED" && (
                                                <Button
                                                    onClick={() => handleUpdateStatus(job, "IN_PROGRESS")}
                                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                                >
                                                    Bilow Shaqada
                                                </Button>
                                            )}
                                            {job.status === "IN_PROGRESS" && (
                                                <Link href={`/provider/jobs`} className="block">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-md transition-all"
                                                    >
                                                        Eeg Faahfaahinta & Dhamaystir
                                                    </Button>
                                                </Link>
                                            )}
                                            {job.status === "COMPLETED" && (
                                                <div className="w-full py-4 flex items-center justify-center gap-2 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-600 text-xs font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Shaqada waa Dhamaatay
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-300">
                                <div className="p-6 bg-white rounded-full shadow-lg shadow-slate-200 mb-4">
                                    <Briefcase className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Ma jiraan shaqooyin aad hayso</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Tag qaybta 'Suuqa' si aad u hesho shaqooyin cusub maanta.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
