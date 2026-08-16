import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Phone", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                try {
                    const rawIdentifier = credentials.identifier.trim();
                    const password = credentials.password;
                    let user = null;

                    // Check if identifier looks like an email
                    if (rawIdentifier.includes("@")) {
                        const email = rawIdentifier.toLowerCase();
                        console.log(`AUTH_DEBUG: Attempting login with EMAIL: ${email}`);
                        user = await prisma.user.findFirst({
                            where: {
                                email: {
                                    equals: email,
                                    mode: "insensitive",
                                },
                            },
                        });
                    } else {
                        console.log(`AUTH_DEBUG: Attempting login with PHONE: ${rawIdentifier}`);
                        // Normalize phone number to match any formatting
                        const cleaned = rawIdentifier.replace(/[\s\-\(\)]/g, "");
                        const digitsOnly = cleaned.replace(/\D/g, "");

                        const possiblePhones = [
                            rawIdentifier,
                            cleaned,
                            // If has +252 or without
                            digitsOnly.startsWith("252") ? `+${digitsOnly}` : `+252${digitsOnly.replace(/^0+/, "")}`,
                            digitsOnly.startsWith("252") ? `+252 ${digitsOnly.slice(3)}` : `+252 ${digitsOnly}`,
                            digitsOnly.startsWith("252") ? digitsOnly.slice(3) : digitsOnly,
                            digitsOnly.replace(/^252/, "").replace(/^0+/, ""),
                            `0${digitsOnly.replace(/^252/, "").replace(/^0+/, "")}`,
                        ];

                        // Find user with any matching variation
                        user = await prisma.user.findFirst({
                            where: {
                                OR: [
                                    { phone: { in: possiblePhones } },
                                    { phone: { contains: digitsOnly.slice(-7) } },
                                ],
                            },
                        });
                    }

                    if (!user) {
                        console.log(`AUTH_FAIL: User not found for identifier: '${rawIdentifier}'`);
                        return null;
                    }

                    console.log(`AUTH_DEBUG: User ${user.phone || user.email} found with role: ${user.role}`);

                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log(`AUTH_FAIL: Invalid password for identifier: '${rawIdentifier}'`);
                        return null;
                    }

                    if (user.accountStatus !== 'ACTIVE') {
                        console.log(`AUTH_BLOCKED: User ${user.phone} is ${user.accountStatus}`);
                        throw new Error("Your account has been deactivated. Contact support.");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        phone: user.phone,
                    };
                } catch (error: any) {
                    console.error("NextAuth authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.phone = token.phone as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.phone = (user as any).phone;
            }
            return token;
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET || "supersecret123",
    logger: {
        error(code, metadata) {
            console.error("NextAuth Error:", code, metadata);
        },
        warn(code) {
            console.warn("NextAuth Warn:", code);
        },
        debug(code, metadata) {
            console.debug("NextAuth Debug:", code, metadata);
        },
    },
};

