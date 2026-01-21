import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, CreditCard, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
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
        <div className="space-y-8 pb-24">
            <div className="flex flex-col gap-1.5 relative z-10">
                <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">Dakhliga</h1>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Halkan kala soco lacagaha kuu soo xarooday iyo kuwa kuu xaroon doona.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black dark:from-black dark:via-zinc-950 dark:to-black text-white border border-white/5 shadow-2xl shadow-foreground/10 overflow-hidden relative group rounded-3xl">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-125 group-hover:rotate-12 duration-700">
                        <DollarSign size={84} className="text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground/60 font-black uppercase tracking-widest text-[10px]">Isku-darka Guud</CardDescription>
                        <CardTitle className="text-3xl font-black">${totalEarnings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[11px] uppercase tracking-widest">
                            <TrendingUp className="h-4 w-4" />
                            <span>+12.5% Markii la barbardhigo bishii hore</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-3xl group transition-all duration-300 hover:shadow-foreground/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground/60 font-black uppercase tracking-widest text-[10px]">Heegan (Pending)</CardDescription>
                        <CardTitle className="text-3xl font-black text-foreground tracking-tight">${pendingEarnings}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-black uppercase tracking-widest">
                            <Clock className="h-4 w-4 opacity-50" />
                            <span>La heli doona 2-3 maalmood</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-3xl group transition-all duration-300 hover:shadow-foreground/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground/60 font-black uppercase tracking-widest text-[10px]">Shaqooyinka Dhamaaday</CardDescription>
                        <CardTitle className="text-3xl font-black text-foreground tracking-tight">{completedJobs}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-primary text-[11px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="h-4 w-4 opacity-60" />
                            <span>Xirfadle firfircoon</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payouts Mock Table */}
            <div className="pt-4">
                <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                        <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    Lacagihii kuu soo dhacay
                </h2>
                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-2xl shadow-foreground/5 ring-1 ring-border rounded-[2.5rem] overflow-hidden">
                    <div className="divide-y divide-border/50">
                        {[
                            { date: "Oct 12, 2025", amount: 450.00, status: "Paid", method: "EVC Plus" },
                            { date: "Oct 01, 2025", amount: 320.50, status: "Paid", method: "e-Dahab" },
                            { date: "Sep 15, 2025", amount: 180.00, status: "Paid", method: "EVC Plus" },
                        ].map((payout, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 border border-border/50">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground tracking-tight text-lg">${payout.amount}</p>
                                        <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{payout.date} via {payout.method}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[10px] uppercase tracking-widest rounded-xl px-4 py-1.5 shadow-xs">
                                        Waa la bixiyay
                                    </Badge>
                                    <ArrowUpRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

