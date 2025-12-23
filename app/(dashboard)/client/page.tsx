import {
    Plus,
    Clock,
    CheckCircle2,
    DollarSign,
    Sparkles,
    ArrowUpRight,
    Loader2,
    RefreshCcw, Bell, Briefcase, Star, MapPin, TrendingUp, Phone, Mail
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { redirect } from "next/navigation";

export default async function ClientDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Fetch real stats
    const activeTasksCount = await prisma.serviceRequest.count({
        where: {
            userId: session.user.id,
            status: { in: ["PENDING", "IN_PROGRESS"] }
        }
    });

    const completedTasksCount = await prisma.serviceRequest.count({
        where: {
            userId: session.user.id,
            status: "COMPLETED"
        }
    });

    // Calculate total spent
    const completedRequests = await prisma.serviceRequest.findMany({
        where: {
            userId: session.user.id,
            status: "COMPLETED",
            price: { not: null }
        },
        select: { price: true }
    });

    const totalSpent = completedRequests.reduce((sum, req) => sum + (req.price || 0), 0);

    // Recent activity
    const recentRequests = await prisma.serviceRequest.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            provider: {
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 5
    });

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Simplified Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-600 font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Elite Member</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Guud ahaan <span className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Macmiilka</span>
                    </h1>
                </div>

                <Link href="/client/create-request">
                    <Button className="h-12 px-6 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] text-white shadow-lg shadow-purple-500/20 rounded-lg font-bold text-sm transition-all group">
                        <Plus className="mr-2 h-4 w-4" />
                        Codsi Cusub
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Premium Styling */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Active Requests */}
                <Card className="group relative border-0 bg-white/60 backdrop-blur-xl shadow-xl shadow-purple-500/5 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 ring-1 ring-gray-100/50">
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-purple-50 to-indigo-50 flex items-center justify-center text-purple-600 mb-4 shadow-sm border border-purple-100/50 group-hover:scale-110 transition-transform">
                            <Clock className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Shaqooyinka Socda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-gray-900 tabular-nums">
                                {String(activeTasksCount).padStart(2, '0')}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Completed Jobs */}
                <Card className="group relative border-0 bg-white/60 backdrop-blur-xl shadow-xl shadow-blue-500/5 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ring-1 ring-gray-100/50">
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 mb-4 shadow-sm border border-blue-100/50 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Dhammaystiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-gray-900 tabular-nums">
                                {String(completedTasksCount).padStart(2, '0')}
                            </span>
                            <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[9px] uppercase tracking-wider">
                                Verified
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Spending Card */}
                {/* Spending Card */}
                <Card className="group relative border-0 bg-primary shadow-2xl shadow-primary/30 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 text-white">
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                    <CardHeader className="pb-2 relative z-10 flex flex-row items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/90">
                            Total Spent
                        </div>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Lacagta Baxday</span>
                            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-white/80">
                            <span>Lifetime Spending</span>
                            <span>USD Currency</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Requests - Normalized Table Rounding */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Dhaqdhaqaaqii u dambeeyay</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Xaaladda tooska ah ee codsiyadaada</p>
                    </div>
                </div>

                {recentRequests.length === 0 ? (
                    <Card className="border-0 bg-white/40 backdrop-blur-md py-24 flex flex-col items-center justify-center gap-6 text-center px-6 rounded-4xl shadow-xl shadow-gray-500/5 ring-1 ring-gray-100/50">
                        <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 shadow-inner">
                            <Clock className="h-10 w-10 text-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl font-black text-gray-900 tracking-tight">Ma jiraan codsiyo hadda</p>
                            <p className="text-sm text-gray-500 font-medium">Abuur codsigaaga ugu horreeya si aad xirfadle u hesho.</p>
                            <Link href="/client/create-request" className="inline-block mt-6">
                                <Button className="h-12 px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-xl shadow-gray-200 transition-all active:scale-[0.98]">
                                    Codsi Cusub
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Table for Desktop */}
                        <Card className="hidden md:block border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-purple-500/5 rounded-4xl overflow-hidden ring-1 ring-gray-100/50">
                            <Table>
                                <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500">Nooca Adeegga</TableHead>
                                        <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500">Xirfadlaha</TableHead>
                                        <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500">Xaaladda</TableHead>
                                        <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500 text-right">Faahfaahin</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentRequests.map((req) => (
                                        <TableRow key={req.id} className="group hover:bg-white border-gray-50 transition-all duration-300">
                                            <TableCell className="px-6 py-5">
                                                <div className="font-black text-gray-900 leading-none">{req.category || "Nooca Adeegga"}</div>
                                                <div className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                {req.provider ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white uppercase">
                                                            {req.provider.user.name.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 tracking-tight">{req.provider.user.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 group/wait">
                                                        <div className="h-8 w-8 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                                                            <Loader2 className="h-3 w-3 text-gray-300 animate-spin" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Waiting...</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                    req.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        req.status === "ACCEPTED" || req.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    <div className={cn(
                                                        "h-1 w-1 rounded-full",
                                                        req.status === "COMPLETED" ? "bg-emerald-500" :
                                                            req.status === "ACCEPTED" || req.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-amber-500"
                                                    )} />
                                                    {req.status.replace("_", " ")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <Link href={`/client/requests`}>
                                                    <Button size="icon" variant="outline" className="h-9 w-9 border-gray-100 rounded-xl hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-sm group-hover:rotate-45">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Cards for Mobile */}
                        <div className="grid gap-4 md:hidden">
                            {recentRequests.map((req) => (
                                <Card key={req.id} className="border border-gray-100 bg-white/60 p-5 rounded-2xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-black text-gray-900 leading-tight">{req.category || "Service Request"}</h3>
                                            <div className="text-[9px] text-gray-400 font-bold flex items-center gap-1">
                                                <Clock className="h-2.5 w-2.5" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                            req.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                req.status === "ACCEPTED" || req.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {req.status.replace("_", " ")}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50/50">
                                        {req.provider ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white uppercase">
                                                    {req.provider.user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-900 leading-tight">{req.provider.user.name}</span>
                                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Xirfadleh</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 opacity-60">
                                                <div className="h-8 w-8 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                                                    <Loader2 className="h-3 w-3 text-gray-300 animate-spin" />
                                                </div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase">Raadinaya...</span>
                                            </div>
                                        )}

                                        <Link href={`/client/requests`}>
                                            <Button size="sm" variant="outline" className="h-8 px-4 rounded-xl border-gray-100 text-[10px] font-black uppercase">
                                                Eeg Faahfaahinta
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
