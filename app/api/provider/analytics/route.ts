import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Ensure user is a provider
        const provider = await (prisma as any).provider.findUnique({
            where: { userId: session.user.id },
            include: {
                wallet: true, // Include wallet if needed for total earnings
            }
        }) as any;

        if (!provider) {
            return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
        }

        // 1. Total Earnings (from Wallet balance or sum of transactions)
        // For now, let's use Wallet Balance as "Current Balance" and maybe sum of COMPLETED EARNING transactions as "Total Revenue"
        // But schema has `balance` in Wallet.

        // Let's verify if wallet exists, if not create one?
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
        // We can get this from provider reviews
        // Provider model has reviews relation? Check schema. Yes.
        const headerReview = await prisma.review.aggregate({
            where: { providerId: provider.id },
            _avg: { rating: true },
            _count: true
        });

        const averageRating = headerReview._avg.rating || 0;
        const totalReviews = headerReview._count;

        // 4. Calculate Total Revenue (Lifetime)
        // Sum of all 'EARNING' transactions
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

        return NextResponse.json({
            stats: {
                totalRevenue: revenue,
                currentBalance: wallet.balance,
                completedJobs: completedJobsCount,
                rating: averageRating,
                totalReviews: totalReviews
            },
            reviews: reviews
        });

    } catch (error) {
        console.error("Provider analytics error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
