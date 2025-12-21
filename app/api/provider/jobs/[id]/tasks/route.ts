import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const job = await prisma.serviceRequest.findUnique({
            where: { id },
            select: { tasks: true },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        const tasks = job.tasks ? JSON.parse(job.tasks) : [];
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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

        const { tasks } = await req.json();

        const job = await prisma.serviceRequest.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Calculate progress
        const completedTasks = tasks.filter((t: any) => t.completed).length;
        const progressPercentage = tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

        const updated = await prisma.serviceRequest.update({
            where: { id },
            data: {
                tasks: JSON.stringify(tasks),
                progressPercentage,
            },
        });

        return NextResponse.json({ tasks, progressPercentage });
    } catch (error) {
        console.error("Error updating tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
