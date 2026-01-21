"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    Users,
    ShieldCheck,
    ShoppingBag,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AdminStats {
    stats: {
        totalUsers: number;
        verifiedProviders: number;
        ongoingJobs: number;
        totalEarnings: number;
    };
    pendingProviders: any[];
    recentRequests: any[];
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const [data, setData] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("AdminDashboard: Session status:", status);
        console.log("AdminDashboard: User role:", session?.user?.role);

        const fetchStats = async () => {
            try {
                console.log("AdminDashboard: Fetching stats...");
                const response = await fetch("/api/admin/stats");
                console.log("AdminDashboard: Response status:", response.status);
                if (response.ok) {
                    const json = await response.json();
                    setData(json);
                } else {
                    const errorText = await response.text();
                    console.error("AdminDashboard: API Error:", errorText);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            if (session?.user?.role === "ADMIN") {
                fetchStats();
            } else {
                console.warn("AdminDashboard: User is not an ADMIN, skipping fetch.");
                setIsLoading(false);
            }
        } else if (status === "unauthenticated") {
            setIsLoading(false);
        }
    }, [status, session]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        console.log("AdminDashboard: Not authorized, redirecting to /client");
        redirect("/client");
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const statsConfig = [
        {
            title: "Wadarta Dadka",
            value: data?.stats.totalUsers || 0,
            description: "+12% bishii u dambeysay",
            icon: Users,
            trend: "up",
            color: "text-blue-600",
            bg: "bg-blue-500/10"
        },
        {
            title: "Providers la Hubiyey",
            value: data?.stats.verifiedProviders || 0,
            description: "Verification status active",
            icon: ShieldCheck,
            trend: "up",
            color: "text-green-600",
            bg: "bg-green-500/10"
        },
        {
            title: "Shaqooyinka Socda",
            value: data?.stats.ongoingJobs || 0,
            description: "Currently in progress",
            icon: ShoppingBag,
            trend: "up",
            color: "text-orange-600",
            bg: "bg-orange-500/10"
        },
        {
            title: "Dakhliga Guud",
            value: `$${data?.stats.totalEarnings?.toLocaleString() || "0"}`,
            description: "Total completed earnings",
            icon: TrendingUp,
            trend: "up",
            color: "text-purple-600",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    Admin <span className="text-primary">Analytics</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                    Ku soo dhowaw qaybta kormeerka guud ee Somali Services.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statsConfig.map((stat, index) => (
                    <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-3xl -mr-8 -mt-8 opacity-50 transition-opacity group-hover:opacity-100`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                                )}
                                <p className="text-xs font-bold text-muted-foreground">
                                    {stat.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Verification Queue & Recent Reports */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/50 bg-card/50 backdrop-blur-md rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Safarka Hubinta (Verification Queue)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(data?.pendingProviders || []).length > 0 ? (
                            data?.pendingProviders.map((provider: any) => (
                                <div key={provider.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden relative">
                                            {provider.user?.image ? (
                                                <img src={provider.user.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                provider.user?.name?.charAt(0).toUpperCase() || "P"
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{provider.user?.name || "Unknown"}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{provider.category} ({provider.city})</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="rounded-xl font-bold" asChild>
                                        <Link href={`/admin/providers`}>Dib u eeg</Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-muted-foreground font-medium bg-muted/30 rounded-2xl border border-dashed border-border">
                                Ma jiraan providers sugaya hubin.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-md rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            Dhaqdhaqaayadii u Dambeeyay
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(data?.recentRequests || []).length > 0 ? (
                            data?.recentRequests.map((req: any) => (
                                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                            <ShoppingBag className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{req.user?.name || "Macmiil"}</p>
                                            <p className="text-xs text-muted-foreground font-medium">Codsiga: {req.description.substring(0, 30)}...</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase px-2 py-1 rounded-full",
                                        req.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"
                                    )}>
                                        {req.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-muted-foreground font-medium bg-muted/30 rounded-2xl border border-dashed border-border">
                                Ma jiraan codsiyo cusub.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
