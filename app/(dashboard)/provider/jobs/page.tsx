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

export default async function ProviderJobsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    let jobs: any[] = [];

    const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id },
    });

    if (provider) {
        jobs = await prisma.serviceRequest.findMany({
            where: {
                providerId: provider.id,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }


    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "WAITING_APPROVAL": return "bg-purple-100 text-purple-700 border-purple-200";
            case "ACCEPTED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
            case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">Shaqooyinkayga</h1>
                <p className="text-sm text-gray-500">Maamul oo la soco shaqooyinka laguu xilsaaray.</p>
            </div>

            {jobs.length === 0 ? (
                <Card className="border-dashed py-10 bg-white/40 backdrop-blur-md rounded-2xl text-center">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-gray-50/50 rounded-xl">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-900">Weli ma haysatid shaqo</p>
                            <p className="text-sm text-gray-500 max-w-sm">
                                Soo fiiri <span className="font-bold text-primary">Suuqa (Market)</span> si aad u hesho shaqo kugu haboon.
                            </p>
                            <Link href="/browse" className="inline-block mt-4">
                                <Button className="h-10 bg-linear-gradient-to-r from-primary to-blue-600 hover:from-indigo-600 hover:to-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 text-xs px-6 uppercase tracking-widest">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Arag Suuqa
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 rounded-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100/50">
                                <CardHeader className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge variant="outline" className={cn("font-black rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wider", getStatusColor(job.status))}>
                                            {job.status.replace("_", " ")}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(job.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg font-black text-gray-900 mb-2 leading-tight">{job.description}</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        ID-ga Shaqada: {job.id.substring(0, 8)}
                                    </CardDescription>

                                    {/* Actions for Provider */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50/50">
                                        <ChatDialog
                                            requestId={job.id}
                                            currentUserId={session.user.id}
                                            recipientName={job.user.name}
                                            triggerLabel="La hadal Macmiilka"
                                        />
                                        {(job.status === "IN_PROGRESS" || job.status === "PENDING") && (
                                            <ProofUpload
                                                jobId={job.id}
                                                disabled={job.progressPercentage < 100}
                                            />
                                        )}
                                        {job.status === "COMPLETED" && (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1.5 h-9 px-3 font-black text-[10px] uppercase tracking-wider rounded-lg">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                Cadaynta shaqada waa la diray
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <div className="md:w-64 p-5 bg-gray-50/30 flex flex-col justify-between gap-4 border-l border-gray-100/50">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-3">Xogta Macmiilka</p>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
                                                {job.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 tracking-tight uppercase">{job.user.name}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Macmiilka</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                                                <Mail className="h-3.5 w-3.5 text-primary opacity-60" />
                                                <span className="truncate">{job.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                                                <Phone className="h-3.5 w-3.5 text-blue-600 opacity-60" />
                                                <span>{job.user.phone || "Telefoon lama hayo"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-auto">
                                        {job.status === "WAITING_APPROVAL" ? (
                                            <div className="bg-purple-50/50 text-purple-600 text-[10px] font-black py-4 px-4 rounded-xl border border-purple-100/50 text-center uppercase tracking-widest">
                                                Sugitaanka Macmiilka
                                            </div>
                                        ) : job.status === "IN_PROGRESS" ? (
                                            <div className="space-y-3">
                                                {job.progressPercentage < 100 && (
                                                    <div className="flex items-center gap-1.5 p-3 bg-white/60 border border-primary/10 rounded-xl text-[9px] font-black text-primary uppercase tracking-widest leading-tight shadow-sm">
                                                        <Clock className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                                                        Dhameystir howlaha (100%) si aad u dirto cadaynta
                                                    </div>
                                                )}
                                                <div className={cn(job.progressPercentage < 100 && "opacity-50 pointer-events-none")}>
                                                    <ProofUpload
                                                        jobId={job.id}
                                                        disabled={job.progressPercentage < 100}
                                                    />
                                                </div>
                                            </div>
                                        ) : job.status === "ACCEPTED" ? (
                                            <JobStatusButton
                                                jobId={job.id}
                                                initialStatus={job.status}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50/50 py-4 rounded-xl border border-emerald-100/50 w-full shadow-sm">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Shaqadii waa dhamaatay
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Job Workflow Panel - Show for IN_PROGRESS or ACCEPTED jobs */}
                            {(job.status === "IN_PROGRESS" || job.status === "ACCEPTED") && (
                                <div className="p-6 pt-0">
                                    <JobWorkflowPanel
                                        jobId={job.id}
                                        timeStarted={job.timeStarted}
                                        totalHours={job.totalHours}
                                        progressPercentage={job.progressPercentage}
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

