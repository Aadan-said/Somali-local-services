import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Try a simple query to see if the DB is reachable
        const userCount = await prisma.user.count();

        return NextResponse.json({
            status: "success",
            database: "connected",
            userCount,
            environment: process.env.NODE_ENV,
            // Don't expose full DB URL, but check if it's set
            dbUrlPresent: !!process.env.POSTGRES_PRISMA_URL || !!process.env.DATABASE_URL
        });
    } catch (error) {
        console.error("DB_DEBUG_ERROR:", error);
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Unknown database error",
            error: String(error)
        }, { status: 500 });
    }
}
