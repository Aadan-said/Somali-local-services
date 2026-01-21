
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
    const envPath = path.join(__dirname, '..', '.env');
    console.log("Checking .env at:", envPath);

    if (!fs.existsSync(envPath)) {
        console.error("❌ .env file NOT FOUND!");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const envVars = {};

    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            // Remove leading/trailing quotes if present
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            if (key && !key.startsWith('#')) {
                envVars[key] = value;
            }
        }
    });

    console.log("Checking Environment Variables:");
    console.log("NEXTAUTH_URL:", envVars['NEXTAUTH_URL'] ? "✅ DEFINED" : "❌ MISSING");
    if (envVars['NEXTAUTH_URL']) console.log("NEXTAUTH_URL Value:", envVars['NEXTAUTH_URL']);

    console.log("POSTGRES_PRISMA_URL:", envVars['POSTGRES_PRISMA_URL'] ? "✅ DEFINED" : "❌ MISSING");

    if (!envVars['POSTGRES_PRISMA_URL']) {
        console.error("❌ Cannot check DB connection because POSTGRES_PRISMA_URL is missing.");
        return;
    }

    // Check strict protocol
    if (!envVars['POSTGRES_PRISMA_URL'].startsWith('postgres')) {
        console.error("❌ Invalid DB URL Protocol. Found:", envVars['POSTGRES_PRISMA_URL'].split(':')[0]);
    }

    console.log("\nAttempting DB Connection...");
    process.env.POSTGRES_PRISMA_URL = envVars['POSTGRES_PRISMA_URL'];
    if (envVars['POSTGRES_URL_NON_POOLING']) {
        process.env.POSTGRES_URL_NON_POOLING = envVars['POSTGRES_URL_NON_POOLING'];
    }

    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        console.log("✅ Successfully connected to DB. User count:", userCount);
    } catch (error) {
        console.error("❌ Failed to connect to DB:", error.message);
        if (error.code) console.error("Error Code:", error.code);
    } finally {
        await prisma.$disconnect();
    }
}

main();
