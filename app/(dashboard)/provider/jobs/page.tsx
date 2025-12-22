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
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">My Jobs</h1>
                <p className="text-gray-500">Manage and update your assigned service jobs.</p>
            </div>

            {jobs.length === 0 ? (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-linear-to-br from-purple-50 to-blue-50 rounded-full">
                            <ShoppingBag className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-900">Weli ma haysatid shaqo</p>
                            <p className="text-sm text-gray-600 max-w-md">
                                Soo fiiri <span className="font-bold text-purple-600">Suuqa (Market)</span> si aad u hesho shaqo kugu haboon.
                                Macaamiishu waxay ku sugayaan adeegyadaada!
                            </p>
                            <Link href="/browse" className="inline-block mt-4">
                                <Button className="bg-linear-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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
                        <Card key={job.id} className="overflow-hidden border-gray-100 hover:shadow-lg transition-all">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <CardHeader className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <Badge variant="outline" className={`font-bold ${getStatusColor(job.status)}`}>
                                            {job.status.replace("_", " ")}
                                        </Badge>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(job.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-3">{job.description}</CardTitle>
                                    <CardDescription className="text-gray-500 line-clamp-2">
                                        Job ID: {job.id.substring(0, 8)} • Standard Service Request
                                    </CardDescription>

                                    {/* Actions for Provider */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                        <ChatDialog
                                            requestId={job.id}
                                            currentUserId={session.user.id}
                                            recipientName={job.user.name}
                                            triggerLabel="Chat with Client"
                                        />
                                        {(job.status === "IN_PROGRESS" || job.status === "PENDING") && (
                                            <ProofUpload
                                                jobId={job.id}
                                                disabled={job.progressPercentage < 100}
                                            />
                                        )}
                                        {job.status === "COMPLETED" && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 gap-1 h-9 px-3">
                                                <ShieldCheck className="h-3 w-3" />
                                                Proof Submitted
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <div className="md:w-72 p-6 bg-gray-50/50 flex flex-col justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-3">Client Contact</p>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-200">
                                                {job.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{job.user.name}</p>
                                                <p className="text-xs text-gray-500">Client</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Mail className="h-3 w-3 text-purple-600" />
                                                <span className="truncate">{job.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Phone className="h-3 w-3 text-blue-600" />
                                                <span>{job.user.phone || "No phone provided"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-auto">
                                        {job.status === "WAITING_APPROVAL" ? (
                                            <div className="bg-purple-50 text-purple-600 text-[10px] font-bold py-3 px-4 rounded-lg border border-purple-100 text-center">
                                                Waiting for Client Approval
                                            </div>
                                        ) : job.status === "IN_PROGRESS" ? (
                                            <div className="space-y-3">
                                                {job.progressPercentage < 100 && (
                                                    <div className="flex items-center gap-1.5 p-2 bg-purple-50 border border-purple-100 rounded-lg text-[9px] font-black text-purple-700 uppercase tracking-widest leading-tight">
                                                        <Clock className="h-3 w-3 shrink-0" />
                                                        Finish all tasks (100%) to submit
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
                                            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xs bg-green-50 py-3 rounded-lg border border-green-100 w-full">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Job Completed
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

