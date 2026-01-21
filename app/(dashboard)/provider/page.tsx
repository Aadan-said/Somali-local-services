"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCcw, Bell, Briefcase, Star, DollarSign, MapPin, TrendingUp, Loader2, CheckCircle2, Phone, Mail, Clock, ShieldCheck, User, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
    const { data: session } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [leads, setLeads] = useState<MarketRequest[]>([]);
    const [myJobs, setMyJobs] = useState<ProviderJob[]>([]);
    const [activeTab, setActiveTab] = useState<"market" | "jobs">("market");
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [isAccepting, setIsAccepting] = useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

    // 1. Fetch Stats
    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch("/api/provider/analytics");
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        new_leads: 0,
                        active_jobs: 0,
                        earnings: data.stats.totalRevenue.toFixed(2),
                        balance: data.stats.currentBalance.toFixed(2),
                        rating: data.stats.rating,
                        reviews: data.reviews
                    });
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        loadStats();
    }, []);

    // 2. Fetch Market Leads
    useEffect(() => {
        const loadLeads = async () => {
            try {
                const res = await fetch("/api/provider/market");
                if (res.ok) setLeads(await res.json());
            } catch (error) {
                console.error("Failed to fetch leads:", error);
            } finally {
                setLoadingLeads(false);
            }
        };
        loadLeads();
    }, []);

    // 3. Fetch My Jobs
    useEffect(() => {
        const loadJobs = async () => {
            try {
                const res = await fetch("/api/provider/jobs");
                if (res.ok) setMyJobs(await res.json());
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoadingJobs(false);
            }
        };
        loadJobs();
    }, []);

    // Combined refresh function for manual button
    const refreshAll = () => {
        setLoadingStats(true);
        setLoadingLeads(true);
        setLoadingJobs(true);

        // Re-run fetches
        fetch("/api/provider/analytics").then(res => res.ok && res.json()).then(data => {
            if (data) setStats(prev => ({ ...prev!, earnings: data.stats.totalRevenue.toFixed(2), balance: data.stats.currentBalance.toFixed(2), rating: data.stats.rating, reviews: data.reviews }));
            setLoadingStats(false);
        });
        fetch("/api/provider/market").then(res => res.ok && res.json()).then(data => { if (data) setLeads(data); setLoadingLeads(false); });
        fetch("/api/provider/jobs").then(res => res.ok && res.json()).then(data => { if (data) setMyJobs(data); setLoadingJobs(false); });
    };

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
        setIsUpdatingStatus(job.id);
        try {
            const res = await fetch(`/api/provider/requests/${job.id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Heerka shaqada waa la cusboonaysiiyay!");
                setMyJobs(myJobs.map(j =>
                    j.id === job.id ? { ...j, status: newStatus } : j
                ));
                // Refetch stats
                const analyticsRes = await fetch("/api/provider/analytics");
                if (analyticsRes.ok) {
                    const analyticsData = await analyticsRes.json();
                    setStats(prev => prev ? ({ ...prev, earnings: analyticsData.stats.totalRevenue.toFixed(2), balance: analyticsData.stats.currentBalance.toFixed(2) }) : null);
                }
                // Refresh the page to show updated workflow data
                router.refresh();
            } else {
                // Show specific error message from backend
                toast.error(data.error || "Waan ka xunnahay, cusubaysiinta heerka shaqadaan cilad ayaa ku timid.");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Ma suuroobin in la cusubaysiiyo hadda. Fadlan internetka hubi.");
        } finally {
            setIsUpdatingStatus(null);
        }
    };



    return (
        <div className="flex flex-col gap-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified Professional</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                        Soo dhawoow <span className="text-primary">{session?.user?.name || "Xirfadle"}</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-md">
                        Maamul shaqooyinkaaga, dakhligaaga, iyo codsiyada cusub ee suuqa.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1.5 bg-card border border-border rounded-xl shadow-sm">
                        <button
                            onClick={() => setActiveTab("market")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-xs font-bold transition-all",
                                activeTab === "market" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Suuqa (Market)
                        </button>
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-xs font-bold transition-all",
                                activeTab === "jobs" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted"
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
                    className="group border-0 bg-card/70 backdrop-blur-xl shadow-xl shadow-foreground/5 rounded-4xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer ring-1 ring-border"
                    onClick={() => setActiveTab("market")}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Codsiyada Cusub</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Bell className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground tabular-nums">
                            {leads.length}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground mt-2">Available Leads</p>
                    </CardContent>
                </Card>

                {/* Active Jobs */}
                <Card
                    className="group border-0 bg-card/70 backdrop-blur-xl shadow-xl shadow-foreground/5 rounded-4xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer ring-1 ring-border"
                    onClick={() => setActiveTab("jobs")}
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Shaqooyinka Socda</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground tabular-nums">
                            {myJobs.filter(j => j.status !== "COMPLETED").length}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground mt-2">Active Tasks</p>
                    </CardContent>
                </Card>

                {/* Rating */}
                <ProviderReviewsDialog
                    reviews={stats?.reviews || []}
                    rating={stats?.rating || 0}
                    trigger={
                        <Card className="group overflow-hidden relative border-0 bg-card/70 backdrop-blur-xl shadow-xl shadow-foreground/5 rounded-4xl hover:shadow-2xl hover:-translate-y-1 transition-all ring-1 ring-border cursor-pointer">
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />

                            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                                <CardTitle className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Qiimaynta</CardTitle>
                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform shadow-inner ring-1 ring-amber-500/20">
                                    <Star className="h-5 w-5 fill-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-4xl font-black text-foreground tabular-nums flex items-end gap-1">
                                    {stats?.rating?.toFixed(1) ?? "0.0"}
                                    <span className="text-lg text-muted-foreground mb-1">/5</span>
                                </div>
                                <p className="text-xs font-bold text-muted-foreground mt-2 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    Client Satisfaction
                                </p>
                            </CardContent>
                        </Card>
                    }
                />
                {/* Earnings Card - CLICKABLE TO WALLET */}
                <Link href="/provider/wallet" className="block col-span-1 sm:col-span-2 lg:col-span-1">
                    <Card className="group relative border-0 bg-gradient-to-br from-primary to-blue-700 shadow-2xl shadow-primary/30 rounded-4xl overflow-hidden hover:scale-[1.02] transition-all duration-500 text-white h-full cursor-pointer">
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
                            {loadingStats ? (
                                <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse mb-4" />
                            ) : (
                                <div className="text-4xl font-black leading-none tracking-tight">
                                    ${stats?.balance || "0.00"}
                                </div>
                            )}
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
                    <h2 className="text-2xl font-black text-foreground tracking-tight">
                        {activeTab === "market" ? "Suuqa Furan (Live Market)" : "Maamulka Shaqooyinka"}
                    </h2>
                    <Button
                        onClick={refreshAll}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-xl border-border bg-card hover:bg-muted text-muted-foreground font-bold text-xs uppercase tracking-wider shadow-sm"
                        disabled={loadingStats || loadingLeads || loadingJobs}
                    >
                        <RefreshCcw className={cn("h-3.5 w-3.5 mr-2", (loadingStats || loadingLeads || loadingJobs) && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                {activeTab === "market" ? (
                    <div className="grid gap-5">
                        {loadingLeads ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 rounded-4xl bg-muted animate-pulse border border-border" />
                                ))}
                            </div>
                        ) : leads.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {leads.map((req) => (
                                    <div key={req.id} className="group relative bg-card/80 backdrop-blur-sm border border-border p-6 rounded-4xl shadow-lg shadow-foreground/5 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                                                    {req.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-foreground leading-tight">{req.user.name}</h3>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {req.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                {req.category}
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-muted-foreground mb-6 line-clamp-2 bg-muted p-3 rounded-xl border border-border/50">
                                            "{req.description}"
                                        </p>

                                        <Button
                                            onClick={() => handleAccept(req.id)}
                                            disabled={isAccepting === req.id}
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all border-0"
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
                            <div className="py-24 flex flex-col items-center justify-center text-center bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border">
                                <div className="p-6 bg-card rounded-full shadow-lg shadow-foreground/5 mb-4 border border-border">
                                    <Clock className="h-10 w-10 text-muted-foreground opacity-40" />
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-2">Suuqa waa madhan yahay</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto">
                                    Hadda ma jiraan codsiyo cusub. Fadlan dib u eeg mar dhow.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {loadingJobs ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 rounded-4xl bg-muted animate-pulse border border-border" />
                                ))}
                            </div>
                        ) : myJobs.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {myJobs.map((job) => (
                                    <div key={job.id} className="group relative bg-card/80 backdrop-blur-md border border-border p-6 rounded-4xl shadow-lg shadow-foreground/5 hover:shadow-xl transition-all duration-300">

                                        {/* Status Badge */}
                                        <div className="absolute top-6 right-6">
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border",
                                                job.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    job.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                        job.status === "WAITING_APPROVAL" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                                            "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {job.status.replace("_", " ")}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6 pr-24">
                                            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground font-black text-lg shadow-inner border border-border">
                                                {job.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground leading-tight">{job.user?.name || 'Unknown User'}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{job.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground bg-muted p-2.5 rounded-xl border border-border/50">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground bg-muted p-2.5 rounded-xl border border-border/50">
                                                <Phone className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                                                {job.user?.phone || "Lama heli karo"}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            {job.status === "WAITING_APPROVAL" && (
                                                <div className="w-full py-4 text-center bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-500 text-xs font-black uppercase tracking-widest">
                                                    Sugitaanka Macmiilka...
                                                </div>
                                            )}
                                            {job.status === "ACCEPTED" && (
                                                <Button
                                                    onClick={() => handleUpdateStatus(job, "IN_PROGRESS")}
                                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all border-0"
                                                >
                                                    Bilow Shaqada
                                                </Button>
                                            )}
                                            {job.status === "IN_PROGRESS" && (
                                                <Link href={`/provider/jobs`} className="block">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-md transition-all"
                                                    >
                                                        Eeg Faahfaahinta
                                                    </Button>
                                                </Link>
                                            )}
                                            {job.status === "COMPLETED" && (
                                                <div className="w-full py-4 flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Shaqada waa Dhamaatay
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border">
                                <div className="p-6 bg-card rounded-full shadow-lg shadow-foreground/5 mb-4 border border-border">
                                    <Briefcase className="h-10 w-10 text-muted-foreground opacity-40" />
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-2">Ma jiraan shaqooyin aad hayso</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto">
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

