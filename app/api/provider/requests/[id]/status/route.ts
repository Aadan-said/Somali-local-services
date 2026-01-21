import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

// Define valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["WAITING_APPROVAL", "CANCELLED"],
    WAITING_APPROVAL: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
};

// Somali error messages
const ERROR_MESSAGES: Record<string, string> = {
    INVALID_TRANSITION: "Ma aqbali kartid isbedelkan heerka. Fadlan raac habka saxda ah.",
    ALREADY_COMPLETED: "Shaqadani way dhamaatey, ma beddeli kartid heerkeeda.",
    ALREADY_CANCELLED: "Shaqadani waa la joojiyay, ma beddeli kartid heerkeeda.",
    MUST_COMPLETE_TASKS: "Fadlan dhamaystir dhammaan hawlaha (100%) ka hor inta aadan dhamaysanin shaqada.",
    MUST_SUBMIT_PROOF: "Fadlan soo gudbi caddeynta shaqada ka hor inta aadan shaqada u calaamadaysanin inay dhammaatay."
};

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(req);
        if (!user || user.role !== "PROVIDER") {
            return NextResponse.json({ error: "Ogolaansho la'aan" }, { status: 401 });
        }

        const { status: newStatus } = await req.json();

        const provider = await prisma.provider.findUnique({
            where: { userId: user.id }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider lama helin" }, { status: 404 });
        }

        const { id: requestId } = await params;

        // Verify the request exists and belongs to this provider
        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return NextResponse.json({ error: "Codsiga lama helin" }, { status: 404 });
        }

        if (request.providerId !== provider.id) {
            return NextResponse.json({
                error: "Ma lihid ogolaansho inaad cusboonaysiiso codsigan"
            }, { status: 403 });
        }

        const currentStatus = request.status;

        // Check if transition is valid
        const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
        if (!allowedTransitions.includes(newStatus)) {
            // Provide specific error messages
            if (currentStatus === "COMPLETED") {
                return NextResponse.json({
                    error: ERROR_MESSAGES.ALREADY_COMPLETED
                }, { status: 400 });
            }
            if (currentStatus === "CANCELLED") {
                return NextResponse.json({
                    error: ERROR_MESSAGES.ALREADY_CANCELLED
                }, { status: 400 });
            }
            return NextResponse.json({
                error: ERROR_MESSAGES.INVALID_TRANSITION
            }, { status: 400 });
        }

        // Special validation for COMPLETED status
        if (newStatus === "COMPLETED") {
            if (request.progressPercentage < 100) {
                return NextResponse.json({
                    error: ERROR_MESSAGES.MUST_COMPLETE_TASKS
                }, { status: 400 });
            }
            if (!request.proofOfWork) {
                return NextResponse.json({
                    error: ERROR_MESSAGES.MUST_SUBMIT_PROOF
                }, { status: 400 });
            }
        }

        // Prepare update data
        const updateData: any = { status: newStatus };

        // Initialize workflow data when transitioning to IN_PROGRESS
        if (newStatus === "IN_PROGRESS" && currentStatus === "ACCEPTED") {
            // Create default tasks if none exist
            const existingTasks = request.tasks ? JSON.parse(request.tasks) : [];

            if (existingTasks.length === 0) {
                const defaultTasks = [
                    { id: "1", text: "Bilow shaqada", completed: false },
                    { id: "2", text: "Qaado sawiro inta shaqada socoto", completed: false },
                    { id: "3", text: "Dhamaystir shaqada si fiican", completed: false }
                ];
                updateData.tasks = JSON.stringify(defaultTasks);
                updateData.progressPercentage = 0;
            }

            // Set time started
            updateData.timeStarted = new Date();
        }

        // Update the request
        const updatedRequest = await prisma.serviceRequest.update({
            where: { id: requestId },
            data: updateData
        });

        // Create notification for client
        if (newStatus === "IN_PROGRESS") {
            await prisma.notification.create({
                data: {
                    userId: request.userId,
                    title: "Shaqada waa bilaabatay",
                    message: `Provider-kaagu wuxuu bilaabay shaqada: ${request.description}`,
                    type: "REQUEST_UPDATE",
                    link: "/client/requests"
                }
            });
        }

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error("UPDATE_STATUS_ERROR:", error);
        return NextResponse.json(
            { error: "Cilad ayaa dhacday. Fadlan mar kale isku day." },
            { status: 500 }
        );
    }
}
