
/**
 * Executes a Prisma operation with retries and exponential backoff.
 * Useful for handling connection pool timeouts, cold starts, and transient database errors in serverless environments.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    baseDelay: number = 400
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) {
                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
                console.log(`Prisma retry attempt ${attempt}/${retries}...`);
            }
            return await operation();
        } catch (error: any) {
            lastError = error;

            const message = (error?.message || "").toLowerCase();
            const code = error?.code || "";

            // Check if it's a retryable transient error
            const isRetryable =
                message.includes("connection pool") ||
                message.includes("connection closed") ||
                message.includes("can't reach database") ||
                message.includes("timeout") ||
                message.includes("timed out") ||
                message.includes("econnreset") ||
                message.includes("connection terminated") ||
                ["P2024", "P1001", "P1002", "P1008", "P1017"].includes(code);

            if (!isRetryable || attempt === retries) {
                throw error;
            }

            console.error(`Prisma transient error (attempt ${attempt}):`, error.message);
        }
    }

    throw lastError;
}

