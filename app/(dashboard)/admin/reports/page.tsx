"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    AlertTriangle,
    MessageSquare,
    Clock,
    FileText,
    ArrowRight,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AdminReport {
    id: string;
    type: string;
    title: string;
    description: string;
    user: { name: string; email: string };
    createdAt: string;
    status: string;
    priority: string;
}

export default function AdminReportsPage() {
    const { data: session, status } = useSession();
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await fetch("/api/admin/reports");
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            toast.error("Waan ku guuldareysanay inaan soo rarno xogta");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchReports();
        }
    }, [status, session]);

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        redirect("/client");
    }

    const handleUpdateStatus = async (reportId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, status: newStatus })
            });

            if (res.ok) {
                toast.success("Statas-ka waa la bedelay");
                fetchReports();
            } else {
                toast.error("Cillad ayaa dhacday");
            }
        } catch (error) {
            toast.error("Waan ku guuldareysanay inaan bedelno status-ka");
        }
    };

    const stats = {
        new: reports.filter(r => r.status === "CUSUB").length,
        inProgress: reports.filter(r => r.status === "LA_EEGEE").length,
        resolved: reports.filter(r => r.status === "LA_XALIDAY").length,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Warbixinada & <span className="text-primary">Cabashooyinka</span></h1>
                <p className="text-muted-foreground font-medium">Halkaan waxaad ka maamuli kartaa cabashooyinka ka imaanaya macaamiisha.</p>
            </div>

            <div className="grid gap-4">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <Card key={report.id} className="border-border/50 bg-card/50 backdrop-blur-md rounded-2xl hover:bg-muted/30 transition-all group">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${report.priority === "HIGH" ? "bg-red-500/10 text-red-600" : "bg-orange-500/10 text-orange-600"}`}>
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase rounded-lg">
                                                {report.type}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                {new Date(report.createdAt).toLocaleDateString('so-SO')}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-lg">{report.title}</h3>
                                        <p className="text-sm text-muted-foreground font-medium">Waxaa soo gudbiyey: <span className="text-foreground font-bold">{report.user.name}</span></p>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1 italic">"{report.description}"</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <Badge className={
                                                report.status === "CUSUB" ? "bg-blue-500/10 text-blue-600" :
                                                    report.status === "LA_EEGEE" ? "bg-orange-500/10 text-orange-600" :
                                                        "bg-green-500/10 text-green-600"
                                            }>
                                                {report.status}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            {report.status !== "LA_XALIDAY" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl text-green-600 hover:bg-green-500/10"
                                                    onClick={() => handleUpdateStatus(report.id, "LA_XALIDAY")}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="rounded-xl group-hover:translate-x-1 transition-transform">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-bold">Ma jiraan cabashooyin hadda.</p>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/50 bg-card/50 backdrop-blur-md rounded-3xl p-6 text-center">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h4 className="font-black text-2xl">{stats.new}</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Cabbashooyin Cusub</p>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-md rounded-3xl p-6 text-center">
                    <Clock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                    <h4 className="font-black text-2xl">{stats.inProgress}</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">In Progress</p>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-md rounded-3xl p-6 text-center">
                    <FileText className="h-8 w-8 text-green-500 mx-auto mb-3" />
                    <h4 className="font-black text-2xl">{stats.resolved}</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Resolved</p>
                </Card>
            </div>
        </div>
    );
}
