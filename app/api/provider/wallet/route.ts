import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get provider and wallet
        const provider = await (prisma as any).provider.findUnique({
            where: { userId: user.id },
            include: {
                wallet: {
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 50
                        }
                    }
                }
            }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
        }

        if (!provider.wallet) {
            const newWallet = await (prisma as any).wallet.create({
                data: { providerId: provider.id }
            });
            return NextResponse.json({
                balance: 0,
                totalEarned: 0,
                thisWeekEarned: 0,
                thisMonthEarned: 0,
                transactions: []
            });
        }

        // Calculate Earnings Stats
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const earnings = await (prisma as any).transaction.findMany({
            where: {
                walletId: provider.wallet.id,
                type: "EARNING",
                status: "COMPLETED"
            }
        });

        const totalEarned = earnings.reduce((acc: number, t: any) => acc + t.amount, 0);
        const thisWeekEarned = earnings
            .filter((t: any) => new Date(t.createdAt) >= startOfWeek)
            .reduce((acc: number, t: any) => acc + t.amount, 0);
        const thisMonthEarned = earnings
            .filter((t: any) => new Date(t.createdAt) >= startOfMonth)
            .reduce((acc: number, t: any) => acc + t.amount, 0);

        return NextResponse.json({
            balance: provider.wallet.balance,
            totalEarned,
            thisWeekEarned,
            thisMonthEarned,
            transactions: provider.wallet.transactions
        });

    } catch (error) {
        console.error("Wallet fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle Deposit and Withdraw
export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, type, description } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const provider = await (prisma as any).provider.findUnique({
            where: { userId: user.id },
            include: { wallet: true }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider not found" }, { status: 404 });
        }

        let wallet = provider.wallet;
        if (!wallet) {
            wallet = await (prisma as any).wallet.create({ data: { providerId: provider.id } });
        }

        let newBalance = wallet.balance;

        if (type === "DEPOSIT") {
            newBalance += amount;
        } else if (type === "WITHDRAWAL") {
            if (wallet.balance < amount) {
                return NextResponse.json({ error: "Haraagaagu kuguma filna." }, { status: 400 });
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
                status: "COMPLETED",
                description: description || (type === "DEPOSIT" ? "Added funds" : "Withdrawal via Somali Mobile Money")
            }
        });

        // Update Wallet Balance
        await (prisma as any).wallet.update({
            where: { id: wallet.id },
            data: { balance: newBalance }
        });

        // Notify Provider
        await (prisma as any).notification.create({
            data: {
                userId: user.id,
                title: type === "DEPOSIT" ? "Lacag Dhigasho" : "Lacag La Bax",
                message: type === "DEPOSIT"
                    ? `$${amount} ayaa lagugu daray jeebkaaga.`
                    : `$${amount} ayaa lagaa saaray jeebkaaga (Withdrawal).`,
                type: "INFO"
            }
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
