import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const job = await prisma.serviceRequest.findUnique({
            where: { id: params.id },
            select: { notes: true },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ notes: job.notes || "" });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { notes } = await req.json();

        const updated = await prisma.serviceRequest.update({
            where: { id: params.id },
            data: { notes },
        });

        return NextResponse.json({ notes: updated.notes });
    } catch (error) {
        console.error("Error updating notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
