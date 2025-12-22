import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: requestId } = await params;

        // Verify the request exists and belongs to the user
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (request.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (request.status !== "WAITING_APPROVAL") {
            return NextResponse.json({ error: "Request is not waiting for approval" }, { status: 400 });
        }

        // Update the request: set status to ACCEPTED
        const updatedRequest = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: {
                status: "ACCEPTED"
            }
        });

        // Optional: Send notification to provider
        if (request.providerId) {
            const provider = await prisma.provider.findUnique({
                where: { id: request.providerId }
            });
            if (provider) {
                await prisma.notification.create({
                    data: {
                        userId: provider.userId,
                        title: "Codsigaagii waa la aqbalay!",
                        message: `Macmiilku wuxuu aqbalay codsigaagii shaqada. Hadda waad bilaabi kartaa.`,
                        type: "REQUEST_UPDATE",
                        link: "/provider"
                    }
                });
            }
        }

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error("APPROVE_REQUEST_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
