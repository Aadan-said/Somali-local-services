
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user wallet (if exists) or create if needed?
        // Let's assume user.wallet
        // But schema is generalized.
        const user = await (prisma as any).user.findUnique({
            where: { id: session.user.id },
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

        // Calculate "Total Spent"
        // Since we don't have a PAYMENT flow yet fully, we can mock or sum PAYMENT transactions if we had them.
        // For now, let's just create 'totalSpent' from wallet transaction sum where type='PAYMENT'
        // If wallet doesn't exist, create it.

        let wallet = user?.wallet;
        if (!wallet) {
            wallet = await (prisma as any).wallet.create({
                data: { userId: session.user.id }
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
