import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, CreditCard, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ProviderEarningsPage() {
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

    const completedJobs = await prisma.serviceRequest.count({
        where: {
            providerId: provider.id,
            status: "COMPLETED",
        },
    });

    // Mocking earnings for now since price isn't in the schema yet
    const estimatedPerJob = 50;
    const totalEarnings = completedJobs * estimatedPerJob;
    const pendingEarnings = 120; // Example pending amount

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Earnings</h1>
                <p className="text-gray-500">Track your income and payment history.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-linear-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12 duration-500">
                        <DollarSign size={80} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Balance</CardDescription>
                        <CardTitle className="text-4xl font-black">${totalEarnings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <TrendingUp className="h-4 w-4" />
                            <span>+12.5% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Pending</CardDescription>
                        <CardTitle className="text-3xl font-black text-gray-900">${pendingEarnings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            <span>Available in 2-3 days</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Jobs Completed</CardDescription>
                        <CardTitle className="text-3xl font-black text-gray-900">{completedJobs}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-purple-600 text-sm font-bold">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Active provider since 2025</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payouts Mock Table */}
            <div className="pt-4">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Recent Payouts
                </h2>
                <Card className="border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {[
                            { date: "Oct 12, 2025", amount: 450.00, status: "Paid", method: "EVC Plus" },
                            { date: "Oct 01, 2025", amount: 320.50, status: "Paid", method: "e-Dahab" },
                            { date: "Sep 15, 2025", amount: 180.00, status: "Paid", method: "EVC Plus" },
                        ].map((payout, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">${payout.amount}</p>
                                        <p className="text-xs text-gray-400">{payout.date} via {payout.method}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold text-[10px] uppercase">
                                        {payout.status}
                                    </Badge>
                                    <ArrowUpRight className="h-4 w-4 text-gray-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Internal icons for the component
function Clock({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}

function CheckCircle2({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>;
}
