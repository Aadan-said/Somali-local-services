import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default async function MyRequestsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const requests = await prisma.serviceRequest.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            provider: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "ACCEPTED": return "bg-purple-100 text-purple-700 border-purple-200";
            case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
            case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="h-4 w-4" />;
            case "ACCEPTED": return <CheckCircle2 className="h-4 w-4" />;
            case "IN_PROGRESS": return <AlertCircle className="h-4 w-4" />;
            case "COMPLETED": return <CheckCircle2 className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">My Requests</h1>
                <p className="text-gray-500">Track and manage your service requests.</p>
            </div>

            {requests.length === 0 ? (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-gray-50 rounded-full">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-900">No requests found</p>
                            <p className="text-sm text-gray-500 max-w-xs">
                                You haven&apos;t created any service requests yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <Card key={request.id} className="overflow-hidden border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <CardHeader className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className={`flex items-center gap-1 font-bold ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                            {request.status.replace("_", " ")}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                            {new Date(request.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                                        {request.description.length > 100
                                            ? request.description.substring(0, 100) + "..."
                                            : request.description}
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Request ID: {request.id.substring(0, 8)}
                                    </CardDescription>
                                </CardHeader>

                                <div className="md:w-64 p-6 bg-gray-50/50 flex flex-col justify-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Provider</p>
                                    {request.provider ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                                {request.provider.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{request.provider.user.name}</p>
                                                <p className="text-xs text-gray-500">{request.provider.category}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Waiting for assignment...</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
