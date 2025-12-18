export const mockRequests = [
    {
        id: "REQ-1001",
        service: "Electrician",
        description: "Circuit breaker keeps tripping when AC is on.",
        date: "2025-12-18",
        status: "Pending",
        client: "Ahmed Hassan",
        location: "Hodan, Mogadishu",
    },
    {
        id: "REQ-1002",
        service: "Plumbing",
        description: "Leaking pipe in the kitchen sink.",
        date: "2025-12-17",
        status: "In Progress",
        client: "Fatima Noor",
        location: "Waberi, Mogadishu",
    },
    {
        id: "REQ-1003",
        service: "AC Repair",
        description: "AC not cooling properly.",
        date: "2025-12-15",
        status: "Completed",
        client: "Mohamed Abdi",
        location: "Hamar Jajab, Mogadishu",
    },
];

export const mockStats = {
    client: {
        active_requests: 2,
        completed_jobs: 5,
        spent: "$150",
    },
    provider: {
        new_leads: 5,
        active_jobs: 3,
        earnings: "$450",
        rating: 4.8,
    }
};
