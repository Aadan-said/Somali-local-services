import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

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

        // Verify the request exists and belongs to the user
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (request.userId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (request.status !== "WAITING_APPROVAL") {
            return NextResponse.json({ error: "Request is not waiting for approval" }, { status: 400 });
        }

        // Update the request: set status to IN_PROGRESS directly (smoother workflow)
        const updatedRequest = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: {
                status: "IN_PROGRESS",
                timeStarted: new Date(),
                // Initialize default tasks if they don't exist
                tasks: request.tasks || JSON.stringify([
                    { id: "1", text: "Bilow shaqada", completed: false },
                    { id: "2", text: "Qaado sawiro inta shaqada socoto", completed: false },
                    { id: "3", text: "Dhamaystir shaqada si fiican", completed: false }
                ])
            }
        });

        // Send notification to provider
        if (request.providerId) {
            const provider = await prisma.provider.findUnique({
                where: { id: request.providerId }
            });
            if (provider) {
                await prisma.notification.create({
                    data: {
                        userId: provider.userId,
                        title: "Shaqadaada waa la aqbalay!",
                        message: `Macmiilku wuxuu aqbalay dalabkaagii. Shaqadu hadda way socotaa (In Progress).`,
                        type: "REQUEST_UPDATE",
                        link: "/provider/jobs"
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
