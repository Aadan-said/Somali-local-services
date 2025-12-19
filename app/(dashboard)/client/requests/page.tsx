import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, MessageCircle, Star, ShieldCheck } from "lucide-react";
import { ChatDialog } from "@/components/chat/chat-dialog";
import { ReviewModal } from "@/components/reviews/review-modal";
import { ClientProgressView } from "@/components/client/client-progress-view";

export default async function MyRequestsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const requests = await prisma.serviceRequest.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            provider: {
                include: {
                    user: true,
                },
            },
            review: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    }) as any[];


    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "ACCEPTED": return "bg-purple-100 text-purple-700 border-purple-200";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
            case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="h-4 w-4" />;
            case "ACCEPTED": return <CheckCircle2 className="h-4 w-4" />;
            case "IN_PROGRESS": return <AlertCircle className="h-4 w-4" />;
            case "COMPLETED": return <CheckCircle2 className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">My Requests</h1>
                <p className="text-gray-500">Track and manage your service requests.</p>
            </div>

            {requests.length === 0 ? (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-full">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-900">No requests found</p>
                            <p className="text-sm text-gray-500 max-w-xs">
                                You haven&apos;t created any service requests yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <Card key={request.id} className="overflow-hidden border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <CardHeader className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className={`flex items-center gap-1 font-bold ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                            {request.status.replace("_", " ")}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                            {new Date(request.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                                        {request.description.length > 100
                                            ? request.description.substring(0, 100) + "..."
                                            : request.description}
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Request ID: {request.id.substring(0, 8)}
                                    </CardDescription>

                                    {request.proofOfWork && (
                                        <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100 space-y-2">
                                            <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-widest">
                                                <ShieldCheck className="h-4 w-4" />
                                                Proof of Work
                                            </div>
                                            {request.proofOfWorkNote && (
                                                <p className="text-sm text-gray-700">{request.proofOfWorkNote}</p>
                                            )}
                                            {request.proofOfWork.startsWith('http') && (
                                                <a href={request.proofOfWork} target="_blank" rel="noopener noreferrer" className="inline-block">
                                                    <img src={request.proofOfWork} alt="Proof" className="h-20 w-32 object-cover rounded-lg border border-green-200" />
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions for Client */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                        {request.provider && (
                                            <ChatDialog
                                                requestId={request.id}
                                                currentUserId={session.user.id}
                                                recipientName={request.provider.user.name}
                                                triggerLabel="Chat with Provider"
                                            />
                                        )}
                                        {request.status === "COMPLETED" && !request.review && (
                                            <ReviewModal
                                                requestId={request.id}
                                                providerId={request.providerId!}
                                                providerName={request.provider?.user.name || "Provider"}
                                            />
                                        )}
                                        {request.review && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 gap-1 h-9 px-3">
                                                <Star className="h-3 w-3 fill-green-700" />
                                                Already Reviewed
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <div className="md:w-64 p-6 bg-gray-50/50 flex flex-col justify-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Provider</p>
                                    {request.provider ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                                {request.provider.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{request.provider.user.name}</p>
                                                <p className="text-xs text-gray-500">{request.provider.category}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Waiting for assignment...</p>
                                    )}
                                </div>
                            </div>

                            {/* Client Progress View - Show workflow status */}
                            {(request.status === "IN_PROGRESS" || request.status === "COMPLETED") && (
                                <div className="p-6 pt-0">
                                    <ClientProgressView
                                        tasks={request.tasks}
                                        progressPercentage={request.progressPercentage}
                                        totalHours={request.totalHours}
                                        notes={request.notes}
                                        timeStarted={request.timeStarted}
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
