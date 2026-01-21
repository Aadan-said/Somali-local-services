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

        const dbUser = await (prisma as any).user.findUnique({
            where: { id: userId },
            include: {
                wallet: {
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 20
                        }
                    }
                }
            }
        });

        let wallet = dbUser?.wallet;
        if (!wallet) {
            wallet = await (prisma as any).wallet.create({
                data: { userId: userId }
            });
        }

        const totalSpentAggregate = await (prisma as any).transaction.aggregate({
            where: {
                walletId: wallet.id,
                type: "PAYMENT",
                status: "COMPLETED"
            },
            _sum: { amount: true }
        });

        const totalSpent = totalSpentAggregate._sum.amount || 0;

        return NextResponse.json({
            balance: wallet.balance,
            totalSpent: totalSpent,
            transactions: wallet.transactions || []
        });

    } catch (error) {
        console.error("Client stats error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
