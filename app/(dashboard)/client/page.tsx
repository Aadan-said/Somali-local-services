import {
    Plus,
    Clock,
    CheckCircle2,
    DollarSign,
    Sparkles,
    ArrowUpRight,
    Loader2
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
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Client <span className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Overview</span>
                    </h1>
                </div>

                <Link href="/client/create-request">
                    <Button className="h-12 px-6 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] text-white shadow-lg shadow-purple-500/20 rounded-lg font-bold text-sm transition-all group">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Normalized Rounding */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Active Requests */}
                <Card className="group relative border border-gray-100 bg-white/60 shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 transition-all">
                    <CardHeader className="pb-2">
                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-4 shadow-sm border border-purple-100">
                            <Clock className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Active Tasks</CardTitle>
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
                <Card className="group relative border border-gray-100 bg-white/60 shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                    <CardHeader className="pb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-sm border border-blue-100">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Completed</CardTitle>
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
                <Card className="group relative border-none bg-linear-to-br from-purple-600 to-blue-600 shadow-lg rounded-lg overflow-hidden hover:scale-[1.01] transition-all text-white">
                    <CardHeader className="pb-2 relative z-10">
                        <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-white/80 font-bold text-[10px] uppercase tracking-widest">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <span className="text-3xl font-black">${totalSpent.toFixed(2)}</span>
                        <div className="h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                            <div className="h-full w-[85%] bg-white rounded-full opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Requests - Normalized Table Rounding */}
            <Card className="border border-gray-100 bg-white/60 shadow-md rounded-lg overflow-hidden">
                <CardHeader className="px-6 py-5 flex flex-row items-center justify-between border-b border-gray-50 bg-gray-50/50">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">Live status of your requests</p>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {recentRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-400 font-medium">No recent activity found.</p>
                            <Link href="/client/create-request">
                                <Button variant="link" className="text-purple-600 font-bold mt-2">
                                    Create your first request
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50/50 border-b border-gray-100">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500">Service Request</TableHead>
                                    <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500 hidden md:table-cell">Professional</TableHead>
                                    <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500 hidden md:table-cell">Status</TableHead>
                                    <TableHead className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500 text-right">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentRequests.map((req) => (
                                    <TableRow key={req.id} className="group hover:bg-white border-gray-50 transition-all duration-300">
                                        <TableCell className="px-6 py-5">
                                            <div className="font-black text-gray-900 leading-none">{req.category || "Service Request"}</div>
                                            <div className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5 hidden md:table-cell">
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
                                        <TableCell className="px-6 py-5 hidden md:table-cell">
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
