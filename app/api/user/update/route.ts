import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { name },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("User update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
