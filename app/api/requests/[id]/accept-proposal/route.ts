import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const acceptSchema = z.object({
    proposalId: z.string(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params; // Request ID
        const body = await req.json();
        const { proposalId } = acceptSchema.parse(body);

        // 1. Verify Request Ownership
        const request = await prisma.serviceRequest.findUnique({
            where: { id: id }
        });

        if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });
        if (request.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Fetch Proposal
        const proposal = await (prisma as any).proposal.findUnique({
            where: { id: proposalId }
        });

        if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        if (proposal.requestId !== id) return NextResponse.json({ error: "Proposal mismatch" }, { status: 400 });

        // 3. Update Request & Proposal (Transaction)
        // Use prisma.$transaction - casting as any for type safety bypass on new models
        await (prisma as any).$transaction([
            // Update Request: Assign Provider, Change Status
            prisma.serviceRequest.update({
                where: { id },
                data: {
                    providerId: proposal.providerId,
                    status: "ACCEPTED", // Or IN_PROGRESS? Let's use ACCEPTED as per workflow
                    price: proposal.price || request.price // Use bid price if available
                }
            }),
            // Update Proposal Status
            (prisma as any).proposal.update({
                where: { id: proposalId },
                data: { status: "ACCEPTED" }
            }),
            // Reject other proposals for this request?
            // Optional: (prisma as any).proposal.updateMany({ where: { requestId: id, NOT: { id: proposalId } }, data: { status: "REJECTED" } })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
