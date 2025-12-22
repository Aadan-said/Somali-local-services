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

        // Get the provider ID before cleaning up
        const providerId = request.providerId;

        // Update the request: set status back to PENDING and clear providerId
        const updatedRequest = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: {
                status: "PENDING",
                providerId: null
            }
        });

        // Optional: Send notification to provider
        if (providerId) {
            const provider = await prisma.provider.findUnique({
                where: { id: providerId }
            });
            if (provider) {
                await prisma.notification.create({
                    data: {
                        userId: provider.userId,
                        title: "Codsigaagii waa la diiday",
                        message: `Macmiilku wuu diiday codsigaagii shaqada. Waad heli kartaa shaqooyin kale.`,
                        type: "INFO",
                        link: "/provider"
                    }
                });
            }
        }

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error("DECLINE_REQUEST_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
