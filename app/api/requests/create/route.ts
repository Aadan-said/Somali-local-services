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

        const body = await req.json();
        const { category, description, location, serviceDate } = body;

        if (!description) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }

        const newRequest = await prisma.serviceRequest.create({
            data: {
                userId: session.user.id,
                category,
                description,
                location,
                serviceDate,
                status: "PENDING",
            },
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error("CREATE_REQUEST_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
