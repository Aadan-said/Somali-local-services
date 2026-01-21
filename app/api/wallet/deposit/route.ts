import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { z } from "zod";

const depositSchema = z.object({
    amount: z.number().positive(),
    phone: z.string().min(9),
    type: z.string().default("DEPOSIT"), // EVC_PLUS, SAHAL, etc.
});

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { amount, phone, type } = depositSchema.parse(body);

        // Find or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId: user.id }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: user.id,
                    balance: 0
                }
            });
        }

        // Update balance and create transaction in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            });

            const transaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type: "DEPOSIT",
                    status: "COMPLETED",
                    description: `Deposit via ${type} (${phone})`
                }
            });

            return { updatedWallet, transaction };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("DEPOSIT_ERROR:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
