import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action } = body;

        const job = await prisma.serviceRequest.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (action === "start") {
            const updated = await prisma.serviceRequest.update({
                where: { id },
                data: {
                    timeStarted: new Date(),
                    status: "IN_PROGRESS",
                },
            });
            return NextResponse.json({
                success: true,
                timeStarted: updated.timeStarted
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        } else if (action === "stop") {
            if (!job.timeStarted) {
                return NextResponse.json({ error: "Timer not started" }, { status: 400 });
            }

            const now = new Date();
            const hoursWorked = (now.getTime() - new Date(job.timeStarted).getTime()) / (1000 * 60 * 60);
            const totalHours = (job.totalHours || 0) + hoursWorked;

            const updated = await prisma.serviceRequest.update({
                where: { id },
                data: {
                    timeCompleted: now,
                    totalHours,
                    timeStarted: null, // Reset for next session
                },
            });

            return NextResponse.json({
                success: true,
                timeCompleted: updated.timeCompleted,
                totalHours: updated.totalHours,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Error managing time:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
