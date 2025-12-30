
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { amount, type, description } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (!type || !["DEPOSIT", "PAYMENT"].includes(type)) {
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        // Get or Create Wallet
        // Since schema allows linking to User directly now
        let wallet = await (prisma as any).wallet.findUnique({
            where: { userId: session.user.id }
        });

        if (!wallet) {
            wallet = await (prisma as any).wallet.create({
                data: { userId: session.user.id }
            });
        }

        // Calculate new balance
        // If DEPOSIT (Adding funds) -> Balance increases
        // If PAYMENT (Paying for service) -> Balance decreases (or allowed to go negative if we treat it as just spending tracking?)
        // Let's assume PAYMENT decreases balance.
        let newBalance = wallet.balance;
        if (type === "DEPOSIT") {
            newBalance += amount;
        } else if (type === "PAYMENT") {
            if (wallet.balance < amount) {
                // For now, let's allow "Direct Payment" even if balance is 0 (Simulating paying from mobile directly, not wallet balance)
                // If we want to simulate "paying from external mobile money", we technically just record the expense.
                // But users usually expect "Wallet" to hold funds.

                // OPTION A: Add funds then pay.
                // OPTION B: Direct Pay (Record as Payment, but doesn't affect wallet balance? No, that's confusing).

                // Let's stick to standard flow:
                // DEPOSIT adds to balance.
                // PAYMENT subtracts from balance.
                return NextResponse.json({ error: "Insufficient wallet balance. Please deposit funds first." }, { status: 400 });
            }
            newBalance -= amount;
        }

        // Transaction
        // Update Wallet Balance
        await (prisma as any).wallet.update({
            where: { id: wallet.id },
            data: { balance: newBalance }
        });

        // Create Transaction Record
        const transaction = await (prisma as any).transaction.create({
            data: {
                walletId: wallet.id,
                amount,
                type,
                status: "COMPLETED",
                description: description || (type === "DEPOSIT" ? "Deposit" : "Payment")
            }
        });

        return NextResponse.json({ success: true, balance: newBalance, transaction });

    } catch (error) {
        console.error("Transaction error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
