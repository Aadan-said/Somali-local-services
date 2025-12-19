import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId, status } = await req.json();

        if (!jobId || !status) {
            return NextResponse.json({ error: "Job ID and status are required" }, { status: 400 });
        }

        // Verify the job belongs to this provider
        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id },
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
        }

        const updatedJob = await prisma.serviceRequest.update({
            where: {
                id: jobId,
                providerId: provider.id
            },
            data: { status },
            include: { user: true }
        });

        // Notify client about status update
        await prisma.notification.create({
            data: {
                userId: updatedJob.userId,
                title: "Job Status Updated",
                message: `Your service request is now ${status.replace("_", " ")}.`,
                type: "REQUEST_UPDATE",
                link: `/client/requests`,
            },
        });

        return NextResponse.json(updatedJob);

    } catch (error) {
        console.error("Job update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
