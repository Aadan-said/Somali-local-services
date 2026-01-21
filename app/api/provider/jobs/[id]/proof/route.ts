import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ error: "Ogolaansho la'aan" }, { status: 401 });
    }

    const { id: jobId } = await params;

    try {
        const provider = await prisma.provider.findUnique({
            where: { userId: user.id },
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider lama helin" }, { status: 404 });
        }

        const { proofOfWork, proofOfWorkNote } = await req.json();

        if (!proofOfWork) {
            return NextResponse.json({
                error: "Fadlan soo gudbi sawirka caddeynta shaqada."
            }, { status: 400 });
        }

        // Check job status and progress
        const job = await prisma.serviceRequest.findUnique({
            where: { id: jobId, providerId: provider.id },
            select: {
                progressPercentage: true,
                status: true,
                userId: true,
                description: true
            }
        });

        if (!job) {
            return NextResponse.json({
                error: "Shaqada lama helin ama ma lihid ogolaansho."
            }, { status: 404 });
        }

        // Validate status is IN_PROGRESS
        if (job.status !== "IN_PROGRESS") {
            return NextResponse.json({
                error: "Waxaad oo keliya soo gudbin kartaa caddeynta marka shaqadu socoto (IN_PROGRESS)."
            }, { status: 400 });
        }

        // Validate progress is exactly 100%
        if (job.progressPercentage !== 100) {
            return NextResponse.json({
                error: `Fadlan marka hore dhamaystir dhammaan hawlaha (100%). Hadda waxaad dhamaysay: ${job.progressPercentage}%`
            }, { status: 400 });
        }

        // Update job with proof and mark as completed (atomic transaction)
        const updatedJob = await prisma.serviceRequest.update({
            where: {
                id: jobId,
                providerId: provider.id,
            },
            data: {
                proofOfWork,
                proofOfWorkNote,
                status: "COMPLETED",
                timeCompleted: new Date(),
            },
            include: { user: true }
        });

        // Notify client that proof has been submitted
        await prisma.notification.create({
            data: {
                userId: job.userId,
                title: "Caddeynta Shaqada waa la soo gudbiyay",
                message: `Provider-kaagu wuxuu soo gudbiyay caddeynta shaqada: ${job.description}. Fadlan daawo.`,
                type: "REQUEST_UPDATE",
                link: "/client/requests",
            },
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("Proof upload error:", error);
        return NextResponse.json({
            error: "Cilad ayaa dhacday soo gudbinta caddeynta. Fadlan mar kale isku day."
        }, { status: 500 });
    }
}
