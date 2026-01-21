import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { z } from "zod";

const applySchema = z.object({
    price: z.number().optional(),
    coverLetter: z.string().optional(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 16 async params
) {
    try {
        const user = await getAuthUser(req);
        if (!user || user.role !== "PROVIDER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { price, coverLetter } = applySchema.parse(body);

        // Get Provider ID
        const provider = await prisma.provider.findUnique({
            where: { userId: user.id }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider profile found" }, { status: 404 });
        }

        // Check if already applied
        const existingProposal = await (prisma as any).proposal.findFirst({
            where: {
                requestId: id,
                providerId: provider.id
            }
        });

        if (existingProposal) {
            return NextResponse.json({ error: "Already applied" }, { status: 400 });
        }

        // Create Proposal
        const proposal = await (prisma as any).proposal.create({
            data: {
                requestId: id,
                providerId: provider.id,
                price,
                coverLetter,
                status: "PENDING"
            }
        });

        return NextResponse.json(proposal);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
