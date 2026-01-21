"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    UserX,
    UserCheck,
    Mail,
    Phone,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Waan ku guuldareysanay inaan soo rarno xogta");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchUsers();
        }
    }, [status, session]);

    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        redirect("/client");
    }

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
        try {
            const res = await fetch("/api/admin/users/toggle-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, status: newStatus })
            });

            if (res.ok) {
                toast.success(`User-ka waa la ${newStatus === "ACTIVE" ? "firfircoonaysiiyey" : "xanibay"}`);
                fetchUsers();
            } else {
                toast.error("Cillad ayaa dhacday");
            }
        } catch (error) {
            toast.error("Waan ku guuldareysanay inaan bedelno status-ka");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Maareynta <span className="text-primary">Users-ka</span></h1>
                    <p className="text-muted-foreground font-medium">Arag, maamul, ama xanib isticmaalayaasha barnamijka.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-2xl font-bold gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="rounded-2xl font-bold gap-2">
                        <Users className="h-4 w-4" /> Ku dar User
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Raadi magac ama email..."
                        className="pl-10 rounded-2xl border-border/50 bg-card/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-border/50 bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">User</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">Xiriirka</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">Role</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-6">Shaqo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden">
                                            {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                                        </div>
                                        <span className="font-bold">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Mail className="h-3 w-3" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Phone className="h-3 w-3" /> {user.phone || "---"}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-lg font-black text-[10px] tracking-tighter uppercase px-2 py-0.5">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={user.accountStatus === "ACTIVE" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "bg-red-500/10 text-red-600 hover:bg-red-500/20"}>
                                        {user.accountStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        {user.accountStatus === "ACTIVE" ? (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="rounded-xl text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleToggleStatus(user.id, user.accountStatus)}
                                            >
                                                <UserX className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="rounded-xl text-green-500 hover:bg-green-500/10"
                                                onClick={() => handleToggleStatus(user.id, user.accountStatus)}
                                            >
                                                <UserCheck className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" className="rounded-xl">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
