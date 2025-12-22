import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;

    try {
        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id },
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider not found" }, { status: 404 });
        }

        const { proofOfWork, proofOfWorkNote } = await req.json();

        // Check if all tasks are completed before marking as COMPLETED
        const jobCheck = await prisma.serviceRequest.findUnique({
            where: { id: jobId, providerId: provider.id },
            select: { progressPercentage: true }
        });

        if (!jobCheck || jobCheck.progressPercentage < 100) {
            return NextResponse.json({
                error: "Fadlan marka hore dhamaystir dhammaan checklist-ka (100%) ka hor inta aadan sawirka cadeynta ah soo dirin."
            }, { status: 400 });
        }

        const updatedJob = await prisma.serviceRequest.update({
            where: {
                id: jobId,
                providerId: provider.id,
            },
            data: {
                proofOfWork,
                proofOfWorkNote,
                status: "COMPLETED", // Mark as completed when proof is submitted
            },
            include: { user: true }
        });

        // Notify client that proof has been submitted
        await prisma.notification.create({
            data: {
                userId: updatedJob.userId,
                title: "Proof of Work Submitted",
                message: "Your provider has submitted evidence of the completed work. Please review it.",
                type: "REQUEST_UPDATE",
                link: "/client/requests",
            },
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("Proof upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
