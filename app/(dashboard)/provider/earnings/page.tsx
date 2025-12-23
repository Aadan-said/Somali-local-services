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

    let completedJobs = 0;

    if (provider) {
        completedJobs = await prisma.serviceRequest.count({
            where: {
                providerId: provider.id,
                status: "COMPLETED",
            },
        });
    }

    // Mocking earnings for now since price isn't in the schema yet
    const estimatedPerJob = 50;
    const totalEarnings = completedJobs * estimatedPerJob;
    const pendingEarnings = 120; // Example pending amount

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">Dakhliga</h1>
                <p className="text-xs text-gray-500">Halkan kala soco lacagaha kuu soo xarooday iyo kuwa kuu xaroon doona.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-linear-to-br from-gray-900 to-gray-800 text-white border-0 shadow-2xl shadow-gray-900/10 overflow-hidden relative group rounded-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform group-hover:scale-125 group-hover:rotate-12 duration-500">
                        <DollarSign size={64} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 font-extrabold uppercase tracking-widest text-[8px]">Isku-darka Guud</CardDescription>
                        <CardTitle className="text-2xl font-black">${totalEarnings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-wider">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>+12.5% Bishi ugu dambeysay</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 rounded-2xl group transition-all duration-300 hover:shadow-indigo-500/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Heegan (Pending)</CardDescription>
                        <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">${pendingEarnings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5 opacity-50" />
                            <span>La heli doona 2-3 maalmood</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 rounded-2xl group transition-all duration-300 hover:shadow-indigo-500/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400 font-black uppercase tracking-widest text-[9px]">Shaqooyinka Dhamaaday</CardDescription>
                        <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">{completedJobs}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5 opacity-60" />
                            <span>Xirfadle firfircoon</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payouts Mock Table */}
            <div className="pt-2">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    Lacagihii kuu soo dhacay
                </h2>
                <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-gray-100/50">
                        {[
                            { date: "Oct 12, 2025", amount: 450.00, status: "Paid", method: "EVC Plus" },
                            { date: "Oct 01, 2025", amount: 320.50, status: "Paid", method: "e-Dahab" },
                            { date: "Sep 15, 2025", amount: 180.00, status: "Paid", method: "EVC Plus" },
                        ].map((payout, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 tracking-tight text-sm">${payout.amount}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{payout.date} via {payout.method}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100/50 font-black text-[9px] uppercase tracking-widest rounded-lg px-2 py-0.5">
                                        Waa la bixiyay
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
