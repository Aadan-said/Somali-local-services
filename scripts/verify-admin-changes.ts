async function verifyAdminChanges() {
    console.log("--- Verifying Admin Changes ---");

    // 1. Verify API endpoint
    try {
        console.log("Checking Admin Stats API...");
        const response = await fetch("http://localhost:3000/api/admin/stats");
        if (response.status === 401) {
            console.log("✅ API returned 401 (Correct for unauthenticated request).");
        } else if (response.ok) {
            const data = await response.json() as any;
            console.log("✅ API is reachable and returning data structure:", Object.keys(data));
        } else {
            console.log("❌ API returned unexpected status:", response.status);
        }
    } catch (error: any) {
        console.log("⚠️ API check failed (is the dev server running?):", error.message || error);
    }

    console.log("--- Verification Complete ---");
}

verifyAdminChanges();
