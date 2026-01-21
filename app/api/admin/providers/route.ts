import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

// GET all providers or pending ones
export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const pendingOnly = searchParams.get("pending") === "true";

        const providers = await prisma.provider.findMany({
            where: {
                ...(pendingOnly && { verified: false })
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                id: "desc"
            }
        });

        return NextResponse.json(providers);
    } catch (error) {
        console.error("[ADMIN_PROVIDERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH approve/reject provider
export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { providerId, verified } = body;

        if (!providerId) {
            return new NextResponse("Provider ID is required", { status: 400 });
        }

        const updatedProvider = await prisma.provider.update({
            where: { id: providerId },
            data: { verified },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Find the user to get the real userId for notification
        const providerFull = await prisma.provider.findUnique({
            where: { id: providerId },
            select: { userId: true }
        });

        // Notify user about verification status
        if (providerFull) {
            await prisma.notification.create({
                data: {
                    userId: providerFull.userId,
                    title: verified ? "Akoonkaaga waa la xaqiijiyey" : "Codsigaga waa la diiday",
                    message: verified
                        ? "Hambalyo! Hadda waxaad tahay adeeg bixiye la hubiyey (Verified Provider)."
                        : "Nasiib daro, nidaamka xaqiijinta kuma guulaysan. Fadlan dib u eeg xogtaada.",
                    type: verified ? "SUCCESS" : "ERROR"
                }
            });
        }

        return NextResponse.json(updatedProvider);
    } catch (error) {
        console.error("[ADMIN_PROVIDERS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
