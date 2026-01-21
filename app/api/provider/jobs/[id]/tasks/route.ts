import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getAuthUser(req);
        if (!user) {
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
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Ogolaansho la'aan" }, { status: 401 });
        }

        const { tasks } = await req.json();

        // Validate tasks array
        if (!Array.isArray(tasks)) {
            return NextResponse.json({
                error: "Xogta hawlaha waa in ay ahaato mid taxan."
            }, { status: 400 });
        }

        const job = await prisma.serviceRequest.findUnique({
            where: { id },
            select: { status: true, providerId: true }
        });

        if (!job) {
            return NextResponse.json({ error: "Shaqada lama helin" }, { status: 404 });
        }

        // Prevent updates on completed or cancelled jobs
        if (job.status === "COMPLETED") {
            return NextResponse.json({
                error: "Ma beddeli kartid hawlaha shaqada la dhameeyay."
            }, { status: 400 });
        }

        if (job.status === "CANCELLED") {
            return NextResponse.json({
                error: "Ma beddeli kartid hawlaha shaqada la joojiyay."
            }, { status: 400 });
        }

        // Calculate progress
        const completedTasks = tasks.filter((t: any) => t.completed).length;
        const progressPercentage = tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

        // Update tasks and progress
        const updated = await prisma.serviceRequest.update({
            where: { id },
            data: {
                tasks: JSON.stringify(tasks),
                progressPercentage,
            },
            select: {
                id: true,
                tasks: true,
                progressPercentage: true,
                status: true
            }
        });

        return NextResponse.json({
            tasks,
            progressPercentage,
            status: updated.status
        });
    } catch (error) {
        console.error("Error updating tasks:", error);
        return NextResponse.json({
            error: "Cilad ayaa dhacday cusboonaysiinta hawlaha. Fadlan mar kale isku day."
        }, { status: 500 });
    }
}
