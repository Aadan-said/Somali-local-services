import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: requestId } = await params;

        // Check if the request exists and belongs to the user
        const serviceRequest = await prisma.serviceRequest.findUnique({
            where: { id: requestId },
        });

        if (!serviceRequest) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (serviceRequest.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Only COMPLETED or WAITING_APPROVAL or ACCEPTED requests can be re-listed?
        // User said "markuu provider shaqo aqablo marka complete gareeyo inuu client shaqdii gabigeeda cancel garayan karo"
        // So mostly COMPLETED or maybe IN_PROGRESS if they want to fire the guy.
        // Let's allow it for COMPLETED, ACCEPTED, IN_PROGRESS, WAITING_APPROVAL.

        const allowedStatuses = ["COMPLETED", "WAITING_APPROVAL", "ACCEPTED", "IN_PROGRESS"];
        if (!allowedStatuses.includes(serviceRequest.status)) {
            return new NextResponse("Invalid status for re-listing", { status: 400 });
        }

        // Delete any existing conversation and review associated with this request
        // This ensures a clean slate for the new provider
        // Delete any existing conversation and review associated with this request
        // This ensures a clean slate for the new provider
        await prisma.$transaction([
            // 1. Delete messages first (to avoid FK constraint)
            prisma.message.deleteMany({
                where: {
                    conversation: {
                        requestId: requestId
                    }
                }
            }),
            // 2. Delete conversation
            prisma.conversation.deleteMany({
                where: { requestId }
            }),
            // 3. Delete review
            prisma.review.deleteMany({
                where: { requestId }
            }),
            // 4. Reset request
            prisma.serviceRequest.update({
                where: { id: requestId },
                data: {
                    status: "PENDING",
                    providerId: null,
                    proofOfWork: null,
                    proofOfWorkNote: null,
                    tasks: null,
                    progressPercentage: 0,
                    notes: null,
                    timeStarted: null,
                    timeCompleted: null,
                    totalHours: 0,
                },
            })
        ]);

        return NextResponse.json({ message: "Codsigaaga si guul leh ayaa loogu soo celiyay suuqa" });
    } catch (error) {
        console.error("[REQUEST_RELIST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
