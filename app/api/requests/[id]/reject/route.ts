import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { z } from "zod";

const rejectSchema = z.object({
    reason: z.string().min(10)
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

        const { id: requestId } = await params;
        const body = await req.json();
        const { reason } = rejectSchema.parse(body);

        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId },
            include: { provider: true }
        });

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (request.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (request.status === "WAITING_APPROVAL") {
            // Case 1: Rejecting a Provider Application
            // Reset job to PENDING so others can apply
            const updated = await prisma.serviceRequest.update({
                where: { id: requestId },
                data: {
                    status: "PENDING",
                    providerId: null, // Remove the provider
                }
            });

            // Notify provider
            if (request.provider) {
                await prisma.notification.create({
                    data: {
                        userId: request.provider.userId,
                        title: "Codsigaagii waa la diiday",
                        message: `Macmiilku wuu diiday codsigaagii shaqada. Sababta: ${reason}`,
                        type: "INFO",
                        link: `/provider/jobs`
                    }
                });
            }
            return NextResponse.json(updated);
        }

        if (request.status === "COMPLETED") {
            // Case 2: Rejecting Completed Work (Requesting Revision)
            // Reset job to IN_PROGRESS for revision
            const updated = await prisma.serviceRequest.update({
                where: { id: requestId },
                data: {
                    status: "IN_PROGRESS",
                    progressPercentage: 75, // Reduce progress
                    proofOfWork: null,
                    proofOfWorkNote: null
                }
            });

            // Notify provider
            if (request.provider) {
                await prisma.notification.create({
                    data: {
                        userId: request.provider.userId,
                        title: "Shaqada waa la diiday",
                        message: `Macmiilku wuu diiday shaqadaada. Sababta: ${reason}`,
                        type: "INFO",
                        link: `/provider/job-details?id=${request.id}`
                    }
                });
            }
            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: "Invalid status for rejection" }, { status: 400 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("REJECT_JOB_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
