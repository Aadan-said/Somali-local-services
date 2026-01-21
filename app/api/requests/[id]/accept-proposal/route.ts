import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { z } from "zod";

const acceptSchema = z.object({
    proposalId: z.string(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
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
        if (request.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Fetch Proposal with relations for notification
        const proposal = await (prisma as any).proposal.findUnique({
            where: { id: proposalId },
            include: {
                provider: {
                    include: {
                        user: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
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
                    status: "IN_PROGRESS",
                    price: proposal.price || request.price,
                    timeStarted: new Date(),
                    tasks: request.tasks || JSON.stringify([
                        { id: "1", text: "Bilow shaqada", completed: false },
                        { id: "2", text: "Qaado sawiro inta shaqada socoto", completed: false },
                        { id: "3", text: "Dhamaystir shaqada si fiican", completed: false }
                    ])
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

        // 4. Notify Provider
        await prisma.notification.create({
            data: {
                userId: proposal.provider.user.id,
                title: "Dalabkaagii waa la aqbalay!",
                message: `Macmiilku wuxuu aqbalay dalabkaagii. Shaqadu hadda way socotaa (In Progress).`,
                type: "REQUEST_UPDATE",
                link: "/provider/jobs"
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
