"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, CreditCard, History, ArrowUpRight, ArrowDownLeft, Loader2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    description: string;
    createdAt: string;
}

export default function ClientWalletPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        balance: 0,
        totalSpent: 0,
        transactions: [] as Transaction[]
    });

    // Form State
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("EVC Plus");
    const [phone, setPhone] = useState("");
    const [processing, setProcessing] = useState(false);
    const [action, setAction] = useState<"DEPOSIT" | "PAYMENT">("DEPOSIT"); // DEPOSIT = Add Funds, PAYMENT = Pay for Service (from Wallet)

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/client/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // For DEPOSIT: We simulate adding funds to wallet via Mobile Money.
            // For PAYMENT: We simulate spending funds from Wallet (or direct mobile pay? API logic currently assumes Wallet Spend).
            // Let's stick to: DEPOSIT adds to Wallet. User can then see "Balance".
            // Since user asked for "Paying all money", maybe they want to PAY someone?
            // But usually you PAY for a specific Job.
            // Here, let's allow "Adding Funds" (Deposit) primarily to show interaction.

            const res = await fetch("/api/client/wallet/transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: action,
                    description: `${action === "DEPOSIT" ? "Added Funds via" : "Paid Service via"} ${method} - ${phone}`
                })
            });

            if (res.ok) {
                toast.success(action === "DEPOSIT" ? "Lacagta waa lagu shubay!" : "Lacag bixinta waa la diray!");
                setAmount("");
                setPhone("");
                fetchStats();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-24 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Jeebka (Wallet)</h1>
                <p className="text-muted-foreground font-medium">La soco qarashkaaga iyo lacag bixinta.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Stats & History */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Total Spent Card */}
                        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary to-indigo-700 p-8 shadow-2xl shadow-primary/20 text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Spent</p>
                                        <p className="text-white/80 text-[10px] uppercase tracking-wide">Lacagta Baxday</p>
                                    </div>
                                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight flex items-baseline gap-1">
                                    <span className="text-2xl text-white/60">$</span>
                                    {stats.totalSpent.toFixed(2)}
                                </h2>
                                <div className="mt-4 px-3 py-1.5 rounded-lg bg-black/20 text-white/90 text-xs font-bold inline-block border border-white/5">
                                    Lifetime Spending
                                </div>
                            </div>
                        </div>

                        {/* Current Balance Card */}
                        <div className="relative overflow-hidden rounded-4xl bg-card p-8 shadow-xl shadow-foreground/5 border border-border">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Current Balance</p>
                                    <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Hadhaaga</p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-2xl">
                                    <Wallet className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-black text-foreground tracking-tight flex items-baseline gap-1">
                                <span className="text-2xl text-muted-foreground">$</span>
                                {stats.balance.toFixed(2)}
                            </h2>
                            <div className="mt-4 flex gap-2">
                                <span className="text-xs text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full font-medium">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <Card className="border-0 shadow-xl shadow-foreground/5 bg-card/80 backdrop-blur-sm rounded-4xl ring-1 ring-border">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-muted rounded-xl border border-border">
                                    <History className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Dhaqdhaqaaqa (Transactions)</CardTitle>
                                    <CardDescription>Lacag bixintii ugu dambeeyay</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-border">
                                        <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Type</TableHead>
                                        <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Description</TableHead>
                                        <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-right">Amount</TableHead>
                                        <TableHead className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.transactions.length > 0 ? (
                                        stats.transactions.map((tx) => (
                                            <TableRow key={tx.id} className="hover:bg-muted/50 border-border group">
                                                <TableCell>
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border",
                                                        tx.type === "PAYMENT" || tx.type === "WITHDRAWAL" || tx.type === "TRANSFER" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                            tx.type === "DEPOSIT" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                                "bg-muted text-muted-foreground border-border"
                                                    )}>
                                                        {tx.type === "PAYMENT" || tx.type === "WITHDRAWAL" || tx.type === "TRANSFER" ? (
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        ) : (
                                                            <ArrowDownLeft className="h-3 w-3" />
                                                        )}
                                                        {tx.type}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground text-xs">
                                                    {tx.description}
                                                </TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-black tabular-nums font-mono text-sm",
                                                    tx.type === "PAYMENT" || tx.type === "TRANSFER" ? "text-foreground" : "text-emerald-500"
                                                )}>
                                                    {tx.type === "PAYMENT" || tx.type === "TRANSFER" ? "-" : "+"}${tx.amount.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                                                Wali wax lacag bixin ah ma samayn.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Mobile Money/Payment Form */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-xl shadow-foreground/5 bg-card rounded-4xl overflow-hidden sticky top-24 ring-1 ring-border">
                        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                        <CardHeader>
                            <CardTitle className="font-bold">Mobile Money</CardTitle>
                            <CardDescription>Ku shubo ama bixi lacag (EVC, Zaad...)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Action Switcher */}
                            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl border border-border">
                                <button
                                    onClick={() => setAction("DEPOSIT")}
                                    className={cn(
                                        "py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all",
                                        action === "DEPOSIT" ? "bg-background text-emerald-500 shadow-sm border border-emerald-500/10" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Deposit
                                </button>
                                <button
                                    onClick={() => setAction("PAYMENT")}
                                    className={cn(
                                        "py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all",
                                        action === "PAYMENT" ? "bg-background text-primary shadow-sm border border-primary/10" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Payment
                                </button>
                            </div>

                            <form onSubmit={handleTransaction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">Adeegga (Provider)</Label>
                                    <Select value={method} onValueChange={setMethod}>
                                        <SelectTrigger className="h-12 rounded-xl bg-background border-border/50 hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 dark:bg-muted/30 dark:border-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EVC Plus">EVC Plus</SelectItem>
                                            <SelectItem value="ZAAD Service">ZAAD Service</SelectItem>
                                            <SelectItem value="eDahab">eDahab</SelectItem>
                                            <SelectItem value="Sahal">Sahal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">Taleefanka</Label>
                                    <Input
                                        placeholder="61xxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 rounded-xl bg-muted border-border hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/10 font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">Lacagta ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            min="1"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="pl-9 h-12 rounded-xl bg-muted border-border hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/10 font-black text-lg"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !amount || !phone}
                                    className={cn(
                                        "w-full h-12 rounded-xl text-white font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 border-0",
                                        action === "DEPOSIT" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                                    )}
                                >
                                    {processing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <span>{action === "DEPOSIT" ? "Ku Shubo (Deposit)" : "Bixi (Pay)"}</span>
                                    )}
                                </Button>
                            </form>

                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-[10px] text-muted-foreground leading-tight border border-border/50">
                                <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground opacity-60" />
                                <p>
                                    Transaction-ku waa <strong>simulation</strong> (tijaabo). Lacagta aad galiso waxay toos ugu biiraysaa Balance-kaaga.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

