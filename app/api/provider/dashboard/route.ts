import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
    console.log("!!! DASHBOARD ROUTE HIT !!!");
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let provider = await prisma.provider.findUnique({
            where: { userId: user.id },
            include: {
                wallet: true,
                reviews: true
            }
        });

        if (!provider) {
            console.log("Provider profile missing, creating one for user:", user.id);
            // Auto-create provider profile + wallet
            // Using default values for required fields
            provider = await prisma.provider.create({
                data: {
                    userId: user.id,
                    category: "General",
                    city: "Mogadishu",
                    verified: false,
                    wallet: {
                        create: {
                            balance: 0,
                            transactions: { create: [] }
                        }
                    }
                },
                include: {
                    wallet: true,
                    reviews: true
                }
            });
        }

        // At this point provider is guaranteed to be non-null
        // We cast it to ensure TypeScript understands
        const secureProvider = provider!;

        // 1. New Leads Count (All Pending requests in the system)
        const newLeadsCount = await prisma.serviceRequest.count({
            where: {
                status: "PENDING"
            }
        });

        // 2. Active Jobs Count (Requests assigned to them and in progress)
        const activeJobsCount = await prisma.serviceRequest.count({
            where: {
                providerId: secureProvider.id,
                status: { in: ["ACCEPTED", "IN_PROGRESS"] }
            }
        });

        // 3. Completed Jobs Count
        const completedJobsCount = await prisma.serviceRequest.count({
            where: {
                providerId: secureProvider.id,
                status: "COMPLETED"
            }
        });

        // 4. Average Rating
        const averageRating = secureProvider.reviews.length > 0
            ? secureProvider.reviews.reduce((sum, r) => sum + r.rating, 0) / secureProvider.reviews.length
            : 5.0;

        // 5. Wallet Balance
        const walletBalance = secureProvider.wallet?.balance || 0;

        // 6. Recent Jobs
        const recentJobsRaw = await prisma.serviceRequest.findMany({
            where: {
                providerId: secureProvider.id
            },
            include: {
                user: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        const recentJobs = recentJobsRaw.map(job => ({
            id: job.id,
            clientName: job.user.name,
            category: job.category || 'Service',
            status: job.status,
            price: job.price || 0,
            createdAt: job.createdAt.toISOString()
        }));

        return NextResponse.json({
            newLeadsCount,
            activeJobsCount,
            completedJobsCount,
            averageRating: parseFloat(averageRating.toFixed(1)),
            walletBalance,
            recentJobs
        });

    } catch (error) {
        console.error("DASHBOARD_API_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
