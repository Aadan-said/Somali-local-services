import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, ArrowRight, Search, Briefcase, Calendar, CheckCircle, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma"; // Direct server access
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JobApplyButton } from "@/components/jobs/job-apply-button";

// Force dynamic rendering so new jobs appear instantly
export const dynamic = "force-dynamic";

export default async function PublicJobsPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const filter = typeof params?.filter === 'string' ? params.filter : 'all'; // 'all', 'open', 'completed'

    // Build query based on filter
    const whereClause: any = {};
    if (filter === 'open') {
        whereClause.status = 'PENDING'; // Adjust based on your status enum
    } else if (filter === 'completed') {
        whereClause.status = 'COMPLETED';
    } else {
        // Show both pending and completed, maybe exclude cancelled?
        whereClause.status = { not: 'CANCELLED' };
    }

    // Server-side fetch
    // Privacy: Select only public fields
    const jobs = await (prisma as any).serviceRequest.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            category: true,
            location: true, // Assuming this is just city/area, not full address
            description: true,
            price: true,
            status: true,
            createdAt: true,
            providerId: true, // Need to know if assigned
        },
        take: 50
    });

    // Get Auth Session
    const session = await getServerSession(authOptions);
    let appliedJobIds: string[] = [];
    let isProvider = false;

    if (session && session.user.role === "PROVIDER") {
        isProvider = true;
        // Fetch provider's proposals
        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        });

        if (provider) {
            const proposals = await (prisma as any).proposal.findMany({
                where: { providerId: provider.id },
                select: { requestId: true }
            });
            appliedJobIds = proposals.map((p: any) => p.requestId);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="container px-4 py-16 md:py-24 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 mb-6">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>Suuqa Shaqada Furan</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Shaqooyinka <span className="text-blue-600">Hadda Socda</span> & Kuwa Dhamaaday
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600">
                        Kaalay, arag shaqooyinka dhabta ah ee laga qabanayo magaaladaada. Haddii aad tahay xirfadle, is-diiwaangeli oo hell shaqo maanta!
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        <Link href="/jobs?filter=all">
                            <Button variant={filter === 'all' ? "default" : "outline"} className="rounded-full px-6">
                                Dhamaan
                            </Button>
                        </Link>
                        <Link href="/jobs?filter=open">
                            <Button variant={filter === 'open' ? "default" : "outline"} className="rounded-full px-6">
                                <Search className="mr-2 h-4 w-4" />
                                Shaqooyinka Furan
                            </Button>
                        </Link>
                        <Link href="/jobs?filter=completed">
                            <Button variant={filter === 'completed' ? "default" : "outline"} className="rounded-full px-6">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                La Qabtay (Completed)
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="container px-4 py-12">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.length > 0 ? (
                        jobs.map((job: any) => (
                            <Card key={job.id} className="group overflow-hidden border-0 shadow-sm shadow-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl bg-white">
                                <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <Badge
                                            variant={job.status === 'COMPLETED' ? 'secondary' : 'default'}
                                            className={`rounded-lg px-3 py-1 font-bold ${job.status === 'COMPLETED'
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {job.status === 'COMPLETED' ? 'LA QABTAY' : 'FURAN'}
                                        </Badge>
                                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 font-bold text-lg text-slate-900 line-clamp-2 min-h-14">
                                        {job.description || "No description provided"}
                                    </h3>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{job.category || "General"}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium truncate">{job.location || "Mogadishu, Somalia"}</span>
                                    </div>

                                    {job.price && (
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                            <span className="font-bold text-slate-900">${job.price}</span>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-2 pb-6 px-6">
                                    {/* Job Apply Action */}
                                    <JobApplyButton
                                        jobId={job.id}
                                        hasApplied={appliedJobIds.includes(job.id)}
                                        jobStatus={job.status}
                                        isProvider={isProvider}
                                    />
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Search className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Shaqooyin lama helin</h3>
                            <p className="text-slate-500">Iskuday inaad bedesho filter-ka ama soo noqo waqti kale.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container px-4 pb-16">
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-3xl opacity-50" />

                    <h2 className="text-3xl md:text-4xl font-black mb-6 relative z-10">Miyaad tahay Xirfadle?</h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">
                        Is-diiwaangeli maanta si aad u hesho shaqooyinkan oo kale. Kumanaan macmiil ayaa ku sugaya!
                    </p>
                    <Link href="/register" className="relative z-10">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12 rounded-xl shadow-lg border-0">
                            Ku Biir Hadda
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
