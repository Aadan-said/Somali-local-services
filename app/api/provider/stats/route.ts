import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id },
            include: {
                reviews: true,
                requests: true
            }
        });

        // 1. New Leads (All Pending requests for now to make market active)
        const newLeadsCount = await prisma.serviceRequest.count({
            where: {
                status: "PENDING"
            }
        });

        if (!provider) {
            return NextResponse.json({
                new_leads: newLeadsCount,
                active_jobs: 0,
                earnings: "$0.00",
                rating: 0
            });
        }

        // 2. Active Jobs (Requests accepted by them and not completed)
        const activeJobsCount = await prisma.serviceRequest.count({
            where: {
                providerId: provider.id,
                status: { in: ["ACCEPTED", "IN_PROGRESS"] }
            }
        });

        // 3. Earnings (Sum of prices for COMPLETED requests)
        const completedRequests = await prisma.serviceRequest.findMany({
            where: {
                providerId: provider.id,
                status: "COMPLETED",
                price: { not: null }
            },
            select: { price: true }
        });

        const totalEarnings = completedRequests.reduce((sum, req) => sum + (req.price || 0), 0);

        // 4. Reputation (Average rating from reviews)
        const rating = provider.reviews.length > 0
            ? provider.reviews.reduce((sum, r) => sum + r.rating, 0) / provider.reviews.length
            : 0;

        return NextResponse.json({
            new_leads: newLeadsCount,
            active_jobs: activeJobsCount,
            earnings: `$${totalEarnings.toFixed(2)}`,
            rating: parseFloat(rating.toFixed(1))
        });

    } catch (error) {
        console.error("STATS_API_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
