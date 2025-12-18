import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const count = await prisma.user.count();
        return NextResponse.json({ message: "Prisma Works", count });
    } catch (e) {
        console.error("Error fetching user count:", e);
        return NextResponse.json({ error: "Failed to retrieve user count." }, { status: 500 });
    }
}
