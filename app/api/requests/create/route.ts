import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { category, description, location, serviceDate } = body;

        if (!description) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }

        const newRequest = await prisma.serviceRequest.create({
            data: {
                userId: user.id,
                category,
                description,
                location,
                serviceDate,
                price: parseFloat(body.price),
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
