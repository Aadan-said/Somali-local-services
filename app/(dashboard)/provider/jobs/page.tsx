import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, Phone, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { JobStatusButton } from "@/components/shared/job-status-button";
import { ChatDialog } from "@/components/chat/chat-dialog";
import { ProofUpload } from "@/components/shared/proof-upload";
import { JobWorkflowPanel } from "@/components/provider/job-workflow-panel";
import { cn } from "@/lib/utils";
import { withRetry } from "@/lib/prisma-utils";

export default async function ProviderJobsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    let jobs: any[] = [];

    let provider;

    try {
        await withRetry(async () => {
            provider = await prisma.provider.findUnique({
                where: { userId: session.user.id },
            });

            if (provider) {
                jobs = await prisma.serviceRequest.findMany({
                    where: { providerId: provider.id },
                    include: { user: true },
                    orderBy: { createdAt: "desc" },
                });
            }
        });
    } catch (error) {
        console.error("Failed to fetch jobs after multiple attempts:", error);
    }


    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "WAITING_APPROVAL": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "ACCEPTED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "COMPLETED": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-black tracking-tight text-foreground">Shaqooyinkayga</h1>
                <p className="text-sm text-muted-foreground">Maamul oo la soco shaqooyinka laguu xilsaaray.</p>
            </div>

            {jobs.length === 0 ? (
                <Card className="border-dashed py-16 bg-card/40 backdrop-blur-md rounded-3xl text-center border-border">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-40" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-foreground">Weli ma haysatid shaqo</p>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Soo fiiri <span className="font-bold text-primary">Suuqa (Market)</span> si aad u hesho shaqo kugu haboon.
                            </p>
                            <Link href="/browse" className="inline-block mt-6">
                                <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 text-xs px-8 uppercase tracking-widest border-0 transition-transform active:scale-95">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Arag Suuqa
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-3xl hover:shadow-foreground/10 transition-all duration-300">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                                <CardHeader className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn("font-black rounded-lg px-3 py-1 text-[10px] uppercase tracking-widest border shadow-xs", getStatusColor(job.status))}>
                                            {job.status.replace("_", " ")}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded-md border border-border">
                                            {new Date(job.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-black text-foreground mb-3 leading-tight">{job.description}</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        ID-ga Shaqada: {job.id.substring(0, 8)}
                                    </CardDescription>

                                    {/* Actions for Provider */}
                                    <div className="flex gap-3 mt-6 pt-6 border-t border-border/50">
                                        <ChatDialog
                                            requestId={job.id}
                                            currentUserId={session.user.id}
                                            recipientName={job.user.name}
                                            triggerLabel="La hadal Macmiilka"
                                        />
                                        {(job.status === "IN_PROGRESS" || job.status === "PENDING" || job.status === "ACCEPTED") && (
                                            <div className="flex-1">
                                                <ProofUpload
                                                    jobId={job.id}
                                                    disabled={(job.progressPercentage ?? 0) < 100}
                                                    progressPercentage={job.progressPercentage ?? 0}
                                                />
                                            </div>
                                        )}
                                        {job.status === "COMPLETED" && (
                                            <div className="h-10 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 font-black text-[10px] uppercase tracking-wider rounded-xl shadow-xs whitespace-nowrap overflow-hidden flex-1 justify-center">
                                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                                <span>Shaqada waa la diray</span>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <div className="md:w-72 p-6 bg-muted/30 flex flex-col justify-between gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary">Macmiilka</p>
                                            <Badge variant="outline" className="text-[8px] font-black border-primary/20 bg-primary/5 text-primary">Client</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 border border-white/10 ring-2 ring-background">
                                                {job.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground tracking-tight uppercase">{job.user.name}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Online Now</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-bold bg-background/50 p-2 rounded-lg border border-border/50">
                                                <Mail className="h-3.5 w-3.5 text-primary/70" />
                                                <span className="truncate">{job.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-bold bg-background/50 p-2 rounded-lg border border-border/50">
                                                <Phone className="h-3.5 w-3.5 text-blue-500/70" />
                                                <span>{job.user.phone || "Telefoon lama hayo"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-1.5 border-t border-border/50">
                                        {job.status === "WAITING_APPROVAL" ? (
                                            <div className="bg-purple-500/10 text-purple-500 text-[10px] font-black py-4 px-4 rounded-xl border border-purple-500/20 text-center uppercase tracking-widest shadow-xs">
                                                Sugitaanka Macmiilka
                                            </div>
                                        ) : job.status === "IN_PROGRESS" ? (
                                            <div className="space-y-3">
                                                {(job.progressPercentage ?? 0) < 100 && (
                                                    <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-tight shadow-sm ring-1 ring-primary/5">
                                                        <Clock className="h-3.5 w-3.5 shrink-0 text-primary animate-pulse" />
                                                        Dhameystir howlaha (100%) si aad u dirto cadaynta
                                                    </div>
                                                )}
                                                <div className={cn((job.progressPercentage ?? 0) < 100 && "opacity-50 pointer-events-none")}>
                                                    <ProofUpload
                                                        jobId={job.id}
                                                        disabled={(job.progressPercentage ?? 0) < 100}
                                                        progressPercentage={job.progressPercentage ?? 0}
                                                    />
                                                </div>
                                            </div>
                                        ) : job.status === "ACCEPTED" ? (
                                            <JobStatusButton
                                                jobId={job.id}
                                                initialStatus={job.status}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 py-4 rounded-xl border border-emerald-500/20 w-full shadow-xs">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Shaqadii waa dhamaatay
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Job Workflow Panel - Show for IN_PROGRESS or ACCEPTED jobs */}
                            {(job.status === "IN_PROGRESS" || job.status === "ACCEPTED") && (
                                <div className="p-6 pt-0 bg-muted/10 border-t border-border/30">
                                    <JobWorkflowPanel
                                        jobId={job.id}
                                        timeStarted={job.timeStarted}
                                        totalHours={job.totalHours}
                                        progressPercentage={job.progressPercentage ?? 0}
                                    />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

