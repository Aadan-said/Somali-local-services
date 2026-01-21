export const logger = {
    info: (message: string, ...args: any[]) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
    },
    error: (message: string, error?: any, ...args: any[]) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error, ...args);
        // TODO: Connect to a service like Sentry or log to a database table
    },
    warn: (message: string, ...args: any[]) => {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV === "development") {
            console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...args);
        }
    },
};
