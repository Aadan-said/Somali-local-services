import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user.id;

        // Fetch user with wallet and its summary
        const dbUser = await (prisma as any).user.findUnique({
            where: { id: userId },
            include: {
                wallet: true
            }
        });

        // Get counts for stats
        const activeTasksCount = await (prisma as any).serviceRequest.count({
            where: {
                userId: userId,
                status: { in: ["PENDING", "ACCEPTED", "IN_PROGRESS"] }
            }
        });

        const completedTasksCount = await (prisma as any).serviceRequest.count({
            where: {
                userId: userId,
                status: "COMPLETED"
            }
        });

        // Calculate "Total Spent"
        let totalSpent = 0;
        if (dbUser?.wallet) {
            const totalSpentAggregate = await (prisma as any).transaction.aggregate({
                where: {
                    walletId: dbUser.wallet.id,
                    type: "PAYMENT",
                    status: "COMPLETED"
                },
                _sum: { amount: true }
            });
            totalSpent = totalSpentAggregate._sum.amount || 0;
        }

        // Get recent requests
        const recentRequests = await (prisma as any).serviceRequest.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                provider: {
                    include: {
                        user: {
                            select: { name: true, image: true }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            activeTasksCount,
            completedTasksCount,
            totalSpent,
            walletBalance: dbUser?.wallet?.balance || 0,
            recentRequests
        });

    } catch (error) {
        console.error("Dashboard consolidated API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
