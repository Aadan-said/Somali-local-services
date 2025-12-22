"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, MessageCircle, Star, ShieldCheck, Loader2, Check, X, Users } from "lucide-react";
import { ChatDialog } from "@/components/chat/chat-dialog";
import { ReviewModal } from "@/components/reviews/review-modal";
import { ClientProgressView } from "@/components/client/client-progress-view";
import { ProviderProfileDialog } from "@/components/client/provider-profile-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MyRequestsPage() {
    const { data: session, status } = useSession();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            toast.error("Wuu dhib ku yimid soo qabashada codsiyada");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login");
        }
        if (status === "authenticated") {
            fetchRequests();
        }
    }, [status]);

    const handleApprove = async (requestId: string) => {
        setIsActioning(requestId + "-approve");
        try {
            const res = await fetch(`/api/requests/${requestId}/approve`, {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Waad aqbashay adeeg bixiyahan!");
                fetchRequests();
            } else {
                toast.error("Wuu dhib ku yimid aqbalida adeeg bixiyaha");
            }
        } catch (error) {
            toast.error("Cilad ayaa dhacday");
        } finally {
            setIsActioning(null);
        }
    };

    const handleDecline = async (requestId: string) => {
        setIsActioning(requestId + "-decline");
        try {
            const res = await fetch(`/api/requests/${requestId}/decline`, {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Waad diiday adeeg bixiyahan. Codsigaaga suuqa ayuu dib ugu laabtay.");
                fetchRequests();
            } else {
                toast.error("Wuu dhib ku yimid diidmada adeeg bixiyaha");
            }
        } catch (error) {
            toast.error("Cilad ayaa dhacday");
        } finally {
            setIsActioning(null);
        }
    };

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="h-4 w-4" />;
            case "WAITING_APPROVAL": return <Clock className="h-4 w-4" />;
            case "ACCEPTED": return <CheckCircle2 className="h-4 w-4" />;
            case "IN_PROGRESS": return <AlertCircle className="h-4 w-4" />;
            case "COMPLETED": return <CheckCircle2 className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

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
                                        <Badge variant="outline" className={cn("flex items-center gap-1 font-bold", getStatusColor(request.status))}>
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
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                                        {request.status === "WAITING_APPROVAL" && (
                                            <>
                                                <Button
                                                    onClick={() => handleApprove(request.id)}
                                                    disabled={isActioning === request.id + "-approve"}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                                    size="sm"
                                                >
                                                    {isActioning === request.id + "-approve" ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Check className="h-4 w-4 mr-2" />
                                                    )}
                                                    Approve Provider
                                                </Button>
                                                <Button
                                                    onClick={() => handleDecline(request.id)}
                                                    disabled={isActioning === request.id + "-decline"}
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50 font-bold"
                                                    size="sm"
                                                >
                                                    {isActioning === request.id + "-decline" ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <X className="h-4 w-4 mr-2" />
                                                    )}
                                                    Decline
                                                </Button>
                                            </>
                                        )}
                                        {request.provider && (
                                            <ChatDialog
                                                requestId={request.id}
                                                currentUserId={session?.user.id!}
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

                                <div className="md:w-64 p-6 bg-gray-50/50 flex flex-col justify-center border-l border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Provider Info</p>
                                    {request.provider ? (
                                        <ProviderProfileDialog
                                            provider={request.provider}
                                            trigger={
                                                <div className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                                                        {request.provider.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{request.provider.user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{request.provider.category}</p>
                                                        <div className="flex items-center gap-1 mt-0.5 text-[9px] font-black text-blue-600 bg-blue-50 w-fit px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                            View Profile
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                                            <Users className="h-5 w-5 text-gray-300 mb-2" />
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center">Finding <br />Provider...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Client Progress View - Show workflow status */}
                            {(request.status === "IN_PROGRESS" || request.status === "COMPLETED" || request.status === "ACCEPTED") && (
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
