import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev"
);

export async function POST(req: Request) {
    console.log("--- LOGIN ATTEMPT START ---");
    try {
        const headers: Record<string, string> = {};
        req.headers.forEach((value: string, key: string) => (headers[key] = value));
        console.log("LOGIN_HEADERS:", JSON.stringify(headers, null, 2));

        console.log("WAITING_FOR_BODY...");
        const body = await req.json();
        console.log("BODY_RECEIVED:", { email: body.email });
        const { email, password, identifier: bodyIdentifier } = body;
        const identifier = bodyIdentifier || email; // Support both 'email' (legacy/web) and 'identifier' (mobile)

        if (!identifier || !password) {
            console.log("LOGIN_FAILED: Missing identifier or password");
            const response = NextResponse.json(
                { error: "Email/Phone and password are required" },
                { status: 400 }
            );
            response.headers.set('Access-Control-Allow-Origin', '*');
            return response;
        }

        // Determine if input is email or phone
        const isEmail = identifier.includes('@');
        let query = {};

        if (isEmail) {
            query = { email: identifier };
        } else {
            // Normalize phone: if it doesn't verify +252 but looks like a number, maybe try formatting?
            // For now, assuming client sends correct format or exact match.
            // Client side sends user-typed input, so we might need fuzzy match or expect standard format.
            // Let's assume client sends formatted or raw. We'll search for exact match first.
            query = { phone: identifier };
        }

        console.log(`LOOKING_UP_USER: ${JSON.stringify(query)}`);

        const user = await prisma.user.findFirst({
            where: query,
        });

        if (!user) {
            console.log("LOGIN_FAILED: User not found", { email });
            const response = NextResponse.json(
                { error: "Invalid email or password", debug: "USER_NOT_FOUND" },
                { status: 400 }
            );
            response.headers.set('Access-Control-Allow-Origin', '*');
            return response;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("LOGIN_FAILED: Invalid password", { email });
            const response = NextResponse.json(
                { error: "Invalid email or password", debug: "INVALID_PASSWORD" },
                { status: 400 }
            );
            response.headers.set('Access-Control-Allow-Origin', '*');
            return response;
        }

        // Generate JWT token
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(JWT_SECRET);

        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            },
            token,
        });

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        const errorResponse = NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
        errorResponse.headers.set('Access-Control-Allow-Origin', '*');
        return errorResponse;
    }
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}
