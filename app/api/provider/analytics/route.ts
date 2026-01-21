import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/prisma-utils";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await withRetry(async () => {
            // Ensure user is a provider
            const provider = await (prisma as any).provider.findUnique({
                where: { userId: user.id },
                include: {
                    wallet: true, // Include wallet if needed for total earnings
                }
            }) as any;

            if (!provider) {
                return null;
            }

            // 1. Total Earnings (from Wallet balance or sum of transactions)
            let wallet = provider.wallet;
            if (!wallet) {
                wallet = await (prisma as any).wallet.create({
                    data: { providerId: provider.id }
                });
            }

            // 2. Jobs Completed
            const completedJobsCount = await prisma.serviceRequest.count({
                where: {
                    providerId: provider.id,
                    status: "COMPLETED"
                }
            });

            // 3. Rating (Average)
            const headerReview = await prisma.review.aggregate({
                where: { providerId: provider.id },
                _avg: { rating: true },
                _count: true
            });

            const averageRating = headerReview._avg.rating || 0;
            const totalReviews = headerReview._count;

            // 4. Calculate Total Revenue (Lifetime)
            const totalRevenue = await (prisma as any).transaction.aggregate({
                where: {
                    walletId: wallet.id,
                    type: "EARNING",
                    status: "COMPLETED"
                },
                _sum: { amount: true }
            });

            // 5. Recent Reviews
            const reviews = await prisma.review.findMany({
                where: { providerId: provider.id },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: { select: { name: true } }, request: { select: { category: true } } }
            });

            const revenue = totalRevenue._sum.amount || 0;

            return {
                stats: {
                    totalRevenue: revenue,
                    currentBalance: wallet.balance,
                    completedJobs: completedJobsCount,
                    rating: averageRating,
                    totalReviews: totalReviews
                },
                reviews: reviews
            };
        });

        if (!data) {
            return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("Provider analytics error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
