import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PROVIDER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { status } = await req.json();
        const validStatuses = ["IN_PROGRESS", "COMPLETED", "CANCELLED"];

        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider not found" }, { status: 404 });
        }

        const { id: requestId } = await params;

        // Verify the request exists and belongs to this provider
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (request.providerId !== provider.id) {
            return NextResponse.json({ error: "Not authorized to update this request" }, { status: 403 });
        }

        const updatedRequest = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: { status }
        });

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error("UPDATE_STATUS_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
