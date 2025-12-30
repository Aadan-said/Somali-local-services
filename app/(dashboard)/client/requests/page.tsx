"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, MessageCircle, Star, ShieldCheck, Loader2, Check, X, Users, RefreshCcw } from "lucide-react";
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
            toast.error("Waan ka xunnahay, xogta codsiyadaada waa lala soo bixi waayay");
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
                toast.success("Hambalyo! Waad aqbashay adeeg bixiyahan.");
                fetchRequests();
            } else {
                toast.error("Waan ka xunnahay, aqbalida adeeg bixiyaha cilad ayaa ku timid");
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
                toast.error("Waan ka xunnahay, diidmada adeeg bixiyaha cilad ayaa ku timid");
            }
        } catch (error) {
            toast.error("Cilad ayaa dhacday");
        } finally {
            setIsActioning(null);
        }
    };

    const handleReList = async (requestId: string) => {
        if (!confirm("Ma hubtaa inaad rabto inaad diido shaqadan oo aad suuqa dib ugu soo celiso? Tani waxay meesha ka saaraysaa adeeg-bixiyaha hadda.")) return;

        setIsActioning(requestId + "-relist");
        try {
            const res = await fetch(`/api/requests/${requestId}/re-list`, {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Codsigaaga si guul leh ayaa loogu soo celiyay suuqa!");
                fetchRequests();
            } else {
                toast.error("Waan ka xunnahay, dib-u-soo-celinta codsiga cilad ayaa ku timid");
            }
        } catch (error) {
            toast.error("Cilad ayaa dhacday");
        } finally {
            setIsActioning(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
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
            case "PENDING": return <Clock className="h-3.5 w-3.5" />;
            case "WAITING_APPROVAL": return <Clock className="h-3.5 w-3.5" />;
            case "ACCEPTED": return <CheckCircle2 className="h-3.5 w-3.5" />;
            case "IN_PROGRESS": return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
            case "COMPLETED": return <CheckCircle2 className="h-3.5 w-3.5" />;
            default: return <Clock className="h-3.5 w-3.5" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-24">
            {/* Header Section */}
            <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">Codsiyadayda</h1>
                </div>
                <p className="text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed">
                    Halkan waxaad kala socon kartaa heerka codsiyadaada, shaqooyinka socda, iyo taariikhda adeegyadii hore.
                </p>
            </div>

            {requests.length === 0 ? (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl p-10 md:p-20 text-center">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-6 p-6 bg-blue-50/50 rounded-full ring-1 ring-blue-100 animate-pulse">
                            <ShoppingBag className="h-12 w-12 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Ma jiraan codsiyo aad dirtay</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                            Weli ma aadan soo gudbin wax codsi ah. Bilow maanta oo hel adeegayaal xirfad leh.
                        </p>
                        <Button className="h-12 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                            Dir Codsi Cusub
                        </Button>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0" />
                </div>
            ) : (
                <div className="grid gap-8">
                    {requests.map((request) => (
                        <Card key={request.id} className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-2xl shadow-xl shadow-slate-200/40 ring-1 ring-white/50 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:bg-white/80">
                            {/* Decorative Gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-primary/5 to-purple-500/5 rounded-bl-[100%] transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

                            <div className="relative p-6 md:p-10 flex flex-col gap-8">
                                {/* Top Bar: Date & Status */}
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={cn("h-10 px-4 rounded-xl text-xs md:text-sm font-bold border flex items-center gap-2 shadow-sm uppercase tracking-wider", getStatusColor(request.status))}>
                                            {getStatusIcon(request.status)}
                                            {request.status.replace("_", " ")}
                                        </Badge>
                                        <div className="h-10 px-4 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(request.createdAt).toLocaleDateString('so-SO', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pl-2">
                                        ID: {request.id.substring(0, 8)}
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid md:grid-cols-[1fr,auto] gap-8 md:gap-12">
                                    {/* Description Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2">
                                                {request.description}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                La gudbiyay: {new Date(request.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>

                                        {/* Proof of Work Section */}
                                        {request.proofOfWork && (
                                            <div className="mt-4 p-5 bg-green-50/50 backdrop-blur-sm rounded-2xl border border-green-100/60 overflow-hidden">
                                                <div className="flex items-center gap-2 text-green-700 font-extrabold text-xs uppercase tracking-widest mb-3">
                                                    <ShieldCheck className="h-4 w-4" />
                                                    Cadaynta Shaqada
                                                </div>
                                                {request.proofOfWorkNote && (
                                                    <p className="text-sm text-gray-700 font-medium mb-3 leading-relaxed">{request.proofOfWorkNote}</p>
                                                )}
                                                {(request.proofOfWork.startsWith('http') || request.proofOfWork.startsWith('data:image')) && (
                                                    <a href={request.proofOfWork} target="_blank" rel="noopener noreferrer" className="block w-full max-w-md overflow-hidden rounded-xl border border-white/50 shadow-sm transition-transform hover:scale-[1.02]">
                                                        <img src={request.proofOfWork} alt="Proof" className="w-full h-48 object-cover" />
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            {request.status === "WAITING_APPROVAL" && (
                                                <>
                                                    <Button
                                                        onClick={() => handleApprove(request.id)}
                                                        disabled={isActioning === request.id + "-approve"}
                                                        className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                                                    >
                                                        {isActioning === request.id + "-approve" ? (
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        ) : (
                                                            <Check className="h-4 w-4 mr-2" />
                                                        )}
                                                        Aqbal Shaqada
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDecline(request.id)}
                                                        disabled={isActioning === request.id + "-decline"}
                                                        variant="outline"
                                                        className="h-11 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold rounded-xl active:scale-95 transition-all"
                                                    >
                                                        {isActioning === request.id + "-decline" ? (
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        ) : (
                                                            <X className="h-4 w-4 mr-2" />
                                                        )}
                                                        Diid
                                                    </Button>
                                                </>
                                            )}
                                            {request.provider && (
                                                <ChatDialog
                                                    requestId={request.id}
                                                    currentUserId={session?.user.id!}
                                                    recipientName={request.provider.user.name}
                                                    triggerLabel="La hadal Adeeg-bixiyaha"
                                                />
                                            )}
                                            {request.status === "COMPLETED" && (
                                                <div className="flex gap-2">
                                                    {!request.review ? (
                                                        <ReviewModal
                                                            requestId={request.id}
                                                            providerId={request.providerId!}
                                                            providerName={request.provider?.user.name || "Provider"}
                                                        />
                                                    ) : (
                                                        <div className="h-11 px-4 rounded-xl bg-green-50 border border-green-100 text-green-700 flex items-center gap-2 font-bold text-sm">
                                                            <Star className="h-4 w-4 fill-green-700" />
                                                            Qiimayntu waa diray
                                                        </div>
                                                    )}
                                                    <Button
                                                        onClick={() => handleReList(request.id)}
                                                        disabled={isActioning === request.id + "-relist"}
                                                        variant="ghost"
                                                        className="h-11 px-6 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-xl border border-red-100 transition-all active:scale-95 flex items-center gap-2 group"
                                                    >
                                                        {isActioning === request.id + "-relist" ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                                                        )}
                                                        <span className="text-xs uppercase tracking-widest">Dib u soo Celi</span>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Provider Info Column */}
                                    <div className="md:w-72">
                                        <div className="h-full bg-slate-50/50 rounded-2xl border border-slate-100/60 p-5 flex flex-col">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                <Users className="h-3 w-3" />
                                                Adeeg-bixiye
                                            </div>

                                            {request.provider ? (
                                                <div className="flex-1 flex flex-col h-full">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20 ring-2 ring-white">
                                                            {request.provider.user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight text-lg">{request.provider.user.name}</p>
                                                            <Badge variant="secondary" className="mt-1 bg-white shadow-sm border-0 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                                {request.provider.category}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto pt-4 border-t border-slate-200/50">
                                                        <ProviderProfileDialog
                                                            provider={request.provider}
                                                            trigger={
                                                                <Button variant="outline" className="w-full bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold text-xs h-10 rounded-xl transition-all">
                                                                    Eeg Profile-ka Buuxa
                                                                </Button>
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col">
                                                    {request.proposals && request.proposals.length > 0 ? (
                                                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px]">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-bold text-slate-500 uppercase">Dalabyada ({request.proposals.length})</span>
                                                            </div>
                                                            {request.proposals.map((proposal: any) => (
                                                                <div key={proposal.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative group hover:border-primary/30 transition-all">
                                                                    <div className="flex items-start gap-3 mb-2">
                                                                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                                            {proposal.provider.user.name.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-900">{proposal.provider.user.name}</p>
                                                                            <p className="text-[10px] text-gray-500">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                                                                        </div>
                                                                        {proposal.price && (
                                                                            <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200 text-[10px] font-bold">
                                                                                ${proposal.price}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {proposal.coverLetter && (
                                                                        <p className="text-[10px] text-gray-600 bg-slate-50 p-2 rounded-lg mb-3 line-clamp-3">
                                                                            "{proposal.coverLetter}"
                                                                        </p>
                                                                    )}
                                                                    <Button
                                                                        onClick={async () => {
                                                                            if (!confirm('Ma hubtaa inaad rabto inaad aqbasho dalabkan?')) return;
                                                                            setIsActioning(proposal.id);
                                                                            try {
                                                                                const res = await fetch(`/api/requests/${request.id}/accept-proposal`, {
                                                                                    method: 'POST',
                                                                                    body: JSON.stringify({ proposalId: proposal.id })
                                                                                });
                                                                                if (res.ok) {
                                                                                    toast.success('Waad aqbashay dalabka!');
                                                                                    fetchRequests();
                                                                                } else {
                                                                                    toast.error('Cilad ayaa dhacday');
                                                                                }
                                                                            } catch (e) { toast.error('Error occurred'); }
                                                                            finally { setIsActioning(null); }
                                                                        }}
                                                                        disabled={isActioning !== null}
                                                                        size="sm"
                                                                        className="w-full h-8 bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-lg"
                                                                    >
                                                                        {isActioning === proposal.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Aqbal Dalabkan"}
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                                            <div className="h-16 w-16 mb-3 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
                                                                <Users className="h-6 w-6 text-slate-300" />
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-500 mb-1">Weli ma hayno</p>
                                                            <p className="text-xs text-slate-400">Codsigaagu wuu furan yahay, sug adeeg-bixiye.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress View Footer */}
                                {(request.status === "IN_PROGRESS" || request.status === "COMPLETED" || request.status === "ACCEPTED") && (
                                    <div className="mt-2 pt-8 border-t border-gray-100/50">
                                        <ClientProgressView
                                            tasks={request.tasks}
                                            progressPercentage={request.progressPercentage}
                                            totalHours={request.totalHours}
                                            notes={request.notes}
                                            timeStarted={request.timeStarted}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
