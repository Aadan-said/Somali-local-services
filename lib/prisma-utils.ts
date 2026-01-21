
/**
 * Executes a Prisma operation with retries and exponential backoff.
 * Useful for handling connection pool timeouts and transient database errors.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    baseDelay: number = 500
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) {
                // Exponential backoff
                const delay = baseDelay * attempt;
                await new Promise((resolve) => setTimeout(resolve, delay));
                console.log(`Prisma retry attempt ${attempt} for operation...`);
            }
            return await operation();
        } catch (error: any) {
            lastError = error;

            // Check if it's a connection pool timeout (Prisma error P2024)
            const isPoolTimeout = error.message?.includes("connection pool") || error.code === "P2024";

            if (!isPoolTimeout || attempt === retries) {
                throw error;
            }

            console.error(`Prisma operation failed (attempt ${attempt}):`, error.message);
        }
    }

    throw lastError;
}
