
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { amount, type, description, recipientId } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        if (!type || !["DEPOSIT", "PAYMENT", "TRANSFER"].includes(type)) {
            return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
        }

        // Get or Create Wallet for current user
        let wallet = await (prisma as any).wallet.findUnique({
            where: { userId: user.id }
        });

        if (!wallet) {
            wallet = await (prisma as any).wallet.create({
                data: { userId: user.id }
            });
        }

        let newBalance = wallet.balance;

        if (type === "DEPOSIT") {
            newBalance += amount;

            // Create Transaction Record
            await (prisma as any).transaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type,
                    status: "COMPLETED",
                    description: description || "Deposit"
                }
            });

            // Update Wallet Balance
            await (prisma as any).wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });

            // Notify User (2 Notifications as requested)
            await (prisma as any).notification.create({
                data: {
                    userId: user.id,
                    title: "Lacag Dhigasho",
                    message: `$${amount} ayaa lagugu daray jeebkaaga.`,
                    type: "INFO"
                }
            });

            await (prisma as any).notification.create({
                data: {
                    userId: user.id,
                    title: "Haraaga Cusub",
                    message: `Haraagaaga hadda waa $${newBalance.toFixed(2)}.`,
                    type: "INFO"
                }
            });

            return NextResponse.json({ success: true, balance: newBalance });

        } else if (type === "PAYMENT") {
            if (wallet.balance < amount) {
                return NextResponse.json({ error: "Insufficient wallet balance." }, { status: 400 });
            }
            newBalance -= amount;

            await (prisma as any).transaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type,
                    status: "COMPLETED",
                    description: description || "Payment"
                }
            });

            await (prisma as any).wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });

            return NextResponse.json({ success: true, balance: newBalance });

        } else if (type === "TRANSFER") {
            if (!recipientId) {
                return NextResponse.json({ error: "Recipient ID required for transfer" }, { status: 400 });
            }

            if (wallet.balance < amount) {
                return NextResponse.json({ error: "Insufficient balance to transfer." }, { status: 400 });
            }

            // Find Recipient (Provider)
            const recipientProvider = await (prisma as any).provider.findUnique({
                where: { id: recipientId },
                include: { user: true, wallet: true }
            });

            if (!recipientProvider) {
                return NextResponse.json({ error: "Recipient provider not found" }, { status: 404 });
            }

            // Ensure recipient has a wallet
            let recipientWallet = recipientProvider.wallet;
            if (!recipientWallet) {
                recipientWallet = await (prisma as any).wallet.create({
                    data: { providerId: recipientProvider.id }
                });
            }

            // Perform Transfer (Atomic-ish)
            // Debit Sender
            newBalance -= amount;
            await (prisma as any).wallet.update({
                where: { id: wallet.id },
                data: { balance: newBalance }
            });

            await (prisma as any).transaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type: "PAYMENT", // Recorded as payment/outgoing for client
                    status: "COMPLETED",
                    description: `Sent to ${recipientProvider.user.name}`
                }
            });

            // Credit Receiver
            await (prisma as any).wallet.update({
                where: { id: recipientWallet.id },
                data: { balance: { increment: amount } }
            });

            await (prisma as any).transaction.create({
                data: {
                    walletId: recipientWallet.id,
                    amount,
                    type: "EARNING", // Recorded as earning for provider
                    status: "COMPLETED",
                    description: `Received from ${user.name}`
                }
            });

            // Notifications (2 for Client, 1 for Provider)
            // To Client - Confirmation
            await (prisma as any).notification.create({
                data: {
                    userId: user.id,
                    title: "Lacag Wareejin",
                    message: `$${amount} ayaad u dirtay ${recipientProvider.user.name}.`,
                    type: "INFO"
                }
            });

            // To Client - New Balance
            await (prisma as any).notification.create({
                data: {
                    userId: user.id,
                    title: "Haraaga Cusub",
                    message: `Haraagaaga hadda waa $${newBalance.toFixed(2)}.`,
                    type: "INFO"
                }
            });

            // To Provider
            await (prisma as any).notification.create({
                data: {
                    userId: recipientProvider.userId,
                    title: "Lacag Laguu Soo Diray",
                    message: `${user.name} ayaa kuu soo diray $${amount}.`,
                    type: "INFO"
                }
            });

            return NextResponse.json({ success: true, balance: newBalance });
        }

        return NextResponse.json({ error: "Invalid operation" }, { status: 400 });

    } catch (error) {
        console.error("Transaction error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wallet = await (prisma as any).wallet.findUnique({
            where: { userId: user.id },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 20
                }
            }
        });

        if (!wallet) {
            return NextResponse.json({ transactions: [], balance: 0 });
        }

        return NextResponse.json({
            transactions: wallet.transactions,
            balance: wallet.balance
        });

    } catch (error) {
        console.error("GET Transactions error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
