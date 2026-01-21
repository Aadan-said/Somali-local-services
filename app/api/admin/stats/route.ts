import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Wadarta Dadka (Total Users)
        const totalUsers = await prisma.user.count();

        // 2. Providers la Hubiyey (Verified Providers)
        const verifiedProviders = await prisma.provider.count({
            where: {
                verified: true
            }
        });

        // 3. Shaqooyinka Socda (Ongoing Jobs - IN_PROGRESS)
        const ongoingJobs = await prisma.serviceRequest.count({
            where: {
                status: "IN_PROGRESS"
            }
        });

        // 4. Dakhliga Guud (Total Earnings - Sum of completed EARNING transactions)
        const transactions = await prisma.transaction.findMany({
            where: {
                type: "EARNING",
                status: "COMPLETED"
            },
            select: {
                amount: true
            }
        });
        const totalEarnings = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        // 5. Verification Queue (Pending Providers)
        const pendingProviders = await prisma.provider.findMany({
            where: {
                verified: false
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            take: 5,
            orderBy: {
                id: 'desc' // Assuming ID or some other field for recency if createdAt is missing on Provider
            }
        });

        // 6. Recent Requests/Issues (Hypothetical for now, using latest ServiceRequests)
        const recentRequests = await prisma.serviceRequest.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            stats: {
                totalUsers,
                verifiedProviders,
                ongoingJobs,
                totalEarnings
            },
            pendingProviders,
            recentRequests
        });
    } catch (error) {
        console.error("[ADMIN_STATS_GET_ERROR]", error);
        return new NextResponse(JSON.stringify({ error: "Internal Error", details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
