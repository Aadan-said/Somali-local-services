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

        // Find or create provider record
        let provider = await prisma.provider.findUnique({
            where: { userId: session.user.id }
        });

        if (!provider) {
            // Create a basic provider record if it doesn't exist
            provider = await prisma.provider.create({
                data: {
                    userId: session.user.id,
                    category: "Other",
                    city: "Mogadishu", // Default city for on-the-fly creation
                }
            });
        }

        const { id: requestId } = await params;

        // Verify the request exists and is still pending
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (request.status !== "PENDING") {
            return NextResponse.json({ error: "Request is no longer pending" }, { status: 400 });
        }

        // Update the request: set status to WAITING_APPROVAL and assign providerId
        const updatedRequest = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: {
                status: "WAITING_APPROVAL",
                providerId: provider.id
            }
        });

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error("ACCEPT_REQUEST_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
