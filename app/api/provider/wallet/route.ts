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

        // Get provider and wallet
        // Cast as any because IDE is stale
        const provider = await (prisma as any).provider.findUnique({
            where: { userId: session.user.id },
            include: {
                wallet: {
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 20 // Recent 20 transactions
                        }
                    }
                }
            }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
        }

        if (!provider.wallet) {
            // Create wallet if doesn't exist
            const newWallet = await (prisma as any).wallet.create({
                data: { providerId: provider.id }
            });
            return NextResponse.json({
                balance: newWallet.balance,
                transactions: []
            });
        }

        return NextResponse.json({
            balance: provider.wallet.balance,
            transactions: provider.wallet.transactions
        });

    } catch (error) {
        console.error("Wallet fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle Deposit (Simulation)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, type, description } = await req.json(); // type: DEPOSIT or WITHDRAWAL

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const provider = await (prisma as any).provider.findUnique({
            where: { userId: session.user.id },
            include: { wallet: true }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider not found" }, { status: 404 });
        }

        if (!provider.wallet) {
            await (prisma as any).wallet.create({ data: { providerId: provider.id } });
            // Re-fetch or just continue?
        }

        // We need wallet ID
        const wallet = await (prisma as any).wallet.findUnique({ where: { providerId: provider.id } });
        if (!wallet) return NextResponse.json({ error: "Wallet error" }, { status: 500 });

        let newBalance = wallet.balance;

        if (type === "DEPOSIT") {
            newBalance += amount;
        } else if (type === "WITHDRAWAL") {
            if (wallet.balance < amount) {
                return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
            }
            newBalance -= amount;
        } else {
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        // Transaction
        const transaction = await (prisma as any).transaction.create({
            data: {
                walletId: wallet.id,
                amount: amount,
                type: type,
                status: "COMPLETED", // Instant for demo
                description: description || (type === "DEPOSIT" ? "Added funds" : "Withdrawal request")
            }
        });

        // Update Wallet Balance
        await (prisma as any).wallet.update({
            where: { id: wallet.id },
            data: { balance: newBalance }
        });

        return NextResponse.json({
            success: true,
            newBalance,
            transaction
        });

    } catch (error) {
        console.error("Transaction error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
