import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, ArrowRight, Search, Briefcase, Calendar, CheckCircle, Filter, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma"; // Direct server access
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JobApplyButton } from "@/components/jobs/job-apply-button";

// Force dynamic rendering so new jobs appear instantly
export const dynamic = "force-dynamic";

export default async function PublicJobsPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const filter = typeof params?.filter === 'string' ? params.filter : 'open'; // 'all', 'open', 'completed'

    // Build query based on filter
    const whereClause: any = {};
    if (filter === 'open') {
        whereClause.status = 'PENDING';
    } else if (filter === 'completed') {
        whereClause.status = 'COMPLETED'; // actually IN_PROGRESS or COMPLETED? usually completed means finished.
    } else {
        // Show all active jobs (Pending, In Progress, Completed) but exclude Cancelled
        whereClause.status = { not: 'CANCELLED' };
    }

    let jobs: any[] = [];
    let appliedJobIds: string[] = [];
    let isProvider = false;

    try {
        // Server-side fetch
        jobs = await (prisma as any).serviceRequest.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                category: true,
                location: true,
                description: true,
                price: true,
                status: true,
                createdAt: true,
                providerId: true,
            },
            take: 50
        });

        // Get Auth Session
        const session = await getServerSession(authOptions);

        if (session && session.user?.role === "PROVIDER" && session.user?.id) {
            isProvider = true;
            const provider = await prisma.provider.findUnique({
                where: { userId: session.user.id },
                select: { id: true }
            });

            if (provider) {
                const proposals = await (prisma as any).proposal.findMany({
                    where: { providerId: provider.id },
                    select: { requestId: true }
                });
                appliedJobIds = proposals.map((p: any) => p.requestId);
            }
        }
    } catch (error) {
        console.error("Jobs page query error:", error);
    }


    return (
        <div className="min-h-screen selection:bg-primary/20 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Animated Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>Suuqa Shaqada Furan</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8">
                        Ma Tahay <br />
                        <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Xirfadle Shaqo Doon Ah?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
                        Kaalay, arag shaqooyinka dhabta ah ee laga qabanayo magaaladaada. Xirfadle, is-diiwaangeli oo hell shaqo maanta!
                    </p>

                    {/* Filter Tabs - Refined */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/jobs?filter=open">
                            <Button variant={filter === 'open' ? "default" : "outline"} className={`h-12 px-8 rounded-2xl font-bold transition-all shadow-lg ${filter === 'open' ? 'bg-primary shadow-primary/20' : 'bg-secondary/10 border-border/10 glass hover:bg-secondary/20'}`}>
                                <Search className="mr-2 h-4 w-4" />
                                Shaqooyinka Furan
                            </Button>
                        </Link>
                        <Link href="/jobs?filter=all">
                            <Button variant={filter === 'all' ? "default" : "outline"} className={`h-12 px-8 rounded-2xl font-bold transition-all shadow-lg ${filter === 'all' ? 'bg-primary shadow-primary/20' : 'bg-secondary/10 border-border/10 glass hover:bg-secondary/20'}`}>
                                Dhamaan
                            </Button>
                        </Link>
                        <Link href="/jobs?filter=completed">
                            <Button variant={filter === 'completed' ? "default" : "outline"} className={`h-12 px-8 rounded-2xl font-bold transition-all shadow-lg ${filter === 'completed' ? 'bg-primary shadow-primary/20' : 'bg-secondary/10 border-border/10 glass hover:bg-secondary/20'}`}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                La Qabtay
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Jobs List (Rows) */}
            <div className="container px-4 py-12 max-w-5xl mx-auto">
                <div className="flex flex-col gap-4">
                    {jobs.length > 0 ? (
                        jobs.map((job: any) => (
                            <div key={job.id} className="group relative glass rounded-4xl border-border/5 hover:border-primary/20 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                                {/* Left: Status Strip & Icon */}
                                <div className="absolute left-0 top-10 bottom-10 w-1 rounded-r-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="shrink-0">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Briefcase className="h-8 w-8" />
                                    </div>
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1 min-w-0 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge
                                            className={`${job.status === 'PENDING'
                                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                : job.status === 'COMPLETED'
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                    : 'bg-muted text-muted-foreground'
                                                } font-bold tracking-widest text-[10px] uppercase border px-3 py-1 rounded-full shadow-sm`}
                                        >
                                            {job.status === 'PENDING' ? 'Shaqo Furan' : job.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-extrabold text-2xl text-foreground leading-tight group-hover:text-primary transition-colors">
                                            {job.description}
                                        </h3>
                                        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground font-semibold">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                {job.location || "Mogadishu"}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                                {job.category || "General Services"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Price & Action */}
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-6 w-full md:w-auto pt-6 md:pt-0 pl-0 md:pl-8 md:border-l border-border/10">
                                    <div className="text-left md:text-right flex-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Misaaniyadda</p>
                                        <p className="text-3xl font-black text-foreground">${job.price || "?"}</p>
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <JobApplyButton
                                            jobId={job.id}
                                            hasApplied={appliedJobIds.includes(job.id)}
                                            jobStatus={job.status}
                                            isProvider={isProvider}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-card rounded-3xl border border-dashed border-border">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">Shaqooyin lama helin</h3>
                            <p className="text-muted-foreground text-sm">Iskuday inaad bedesho filter-ka ama soo noqo waqti kale.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-primary/95 to-blue-800 p-10 md:p-16 text-center text-white shadow-3xl isolate transform hover:scale-[1.002] transition-transform duration-700 border border-white/10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-[100px] animate-pulse delay-700" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-left">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Ma Tahay <br className="hidden md:block" />
                                <span className="bg-gradient-to-r from-white via-blue-100 to-white/80 bg-clip-text text-transparent italic">Xirfadle Diyaar Ah?</span>
                            </h2>
                            <p className="text-white/80 text-lg max-w-md font-medium">
                                Is-diiwaangeli maanta si aad u hesho shaqooyinka xirfadaada kugu habboon.
                            </p>
                        </div>
                        <Link href="/register">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/95 font-black px-12 h-16 rounded-2xl shadow-2xl shadow-black/20 border-0 shrink-0 hover:-translate-y-1 transition-all active:scale-95 group">
                                Ku Biir Hadda
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

