import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, Phone, Mail } from "lucide-react";
import { JobStatusButton } from "@/components/shared/job-status-button";

export default async function ProviderJobsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const provider = await prisma.provider.findUnique({
        where: { userId: session.user.id },
    });

    if (!provider) {
        redirect("/onboarding");
    }

    const jobs = await prisma.serviceRequest.findMany({
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
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
                        <div className="p-4 bg-gray-50 rounded-full">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-900">No jobs assigned yet</p>
                            <p className="text-sm text-gray-500 max-w-xs">
                                When customers request your services, they will appear here.
                            </p>
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
                                        <JobStatusButton jobId={job.id} initialStatus={job.status} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
