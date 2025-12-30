"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Loader2, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Transaction {
    id: string;
    amount: number;
    type: "EARNING" | "WITHDRAWAL" | "DEPOSIT";
    status: string;
    description: string;
    createdAt: string;
}

export default function WalletPage() {
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form states
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("EVC Plus");
    const [phone, setPhone] = useState("");
    const [action, setAction] = useState<"DEPOSIT" | "WITHDRAWAL">("DEPOSIT");

    const fetchWallet = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/provider/wallet");
            if (res.ok) {
                const data = await res.json();
                setBalance(data.balance);
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to fetch wallet:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await fetch("/api/provider/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: action,
                    description: `${action === "DEPOSIT" ? "Deposit via" : "Withdrawal to"} ${method} (${phone})`
                })
            });

            if (res.ok) {
                toast.success(`${action === "DEPOSIT" ? "Dalabkaaga waa la helay (Deposit)" : "Lacag bixinta waa la diray (Withdrawal)"}`);
                setAmount("");
                setPhone("");
                fetchWallet(); // Refresh data
            } else {
                const err = await res.json();
                toast.error(err.error || "Cilad ayaa dhacday");
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
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jeebka (Wallet)</h1>
                <p className="text-slate-500 font-medium">Maamul dhaqaalahaaga, dir oo la bax lacagta.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Balance Card & Actions */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Virtual Card */}
                    <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl text-white">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10" />

                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-1">Current Balance</p>
                                    <h2 className="text-5xl font-black tracking-tight flex items-baseline gap-1">
                                        <span className="text-3xl text-white/60">$</span>
                                        {balance.toFixed(2)}
                                    </h2>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                    <Wallet className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-8">
                                <div className="space-y-1">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Provider ID</p>
                                    <p className="font-mono text-white/80 tracking-wider">**** **** 4289</p>
                                </div>
                                <div className="px-4 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wide">
                                    Active Status
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm rounded-4xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 rounded-xl">
                                    <History className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Dhaqdhaqaaqa (Transactions)</CardTitle>
                                    <CardDescription>Lacagihii ugu dambeeyay ee soo galay ama baxay</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Type</TableHead>
                                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Description</TableHead>
                                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Amount</TableHead>
                                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length > 0 ? (
                                        transactions.map((tx) => (
                                            <TableRow key={tx.id} className="hover:bg-slate-50/50 border-slate-100 group">
                                                <TableCell>
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border",
                                                        tx.type === "DEPOSIT" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            tx.type === "EARNING" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                                "bg-amber-50 text-amber-600 border-amber-100"
                                                    )}>
                                                        {tx.type === "DEPOSIT" || tx.type === "EARNING" ? (
                                                            <ArrowDownLeft className="h-3 w-3" />
                                                        ) : (
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        )}
                                                        {tx.type}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-700 text-xs">
                                                    {tx.description}
                                                </TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-black tabular-nums",
                                                    tx.type === "WITHDRAWAL" ? "text-slate-900" : "text-emerald-600"
                                                )}>
                                                    {tx.type === "WITHDRAWAL" ? "-" : "+"}${tx.amount.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-slate-400 tabular-nums">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-slate-400 text-sm">
                                                Wali wax dhaqdhaqaaq ah ma samayn.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white rounded-4xl overflow-hidden">
                        <div className="h-2 bg-linear-to-r from-blue-600 to-purple-600" />
                        <CardHeader>
                            <CardTitle className="font-bold">Maamul Lacagta</CardTitle>
                            <CardDescription>Ku shubo ama kala bax lacag</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Action Switcher */}
                            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                <button
                                    onClick={() => setAction("DEPOSIT")}
                                    className={cn(
                                        "py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all",
                                        action === "DEPOSIT" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Deposit
                                </button>
                                <button
                                    onClick={() => setAction("WITHDRAWAL")}
                                    className={cn(
                                        "py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all",
                                        action === "WITHDRAWAL" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Withdraw
                                </button>
                            </div>

                            <form onSubmit={handleTransaction} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">Adeegga (Service)</Label>
                                    <Select value={method} onValueChange={setMethod}>
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sahal">Sahal</SelectItem>
                                            <SelectItem value="EVC Plus">EVC Plus</SelectItem>
                                            <SelectItem value="ZAAD Service">ZAAD Service</SelectItem>
                                            <SelectItem value="eDahab">eDahab</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">Taleefanka</Label>
                                    <Input
                                        placeholder="61xxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-200 hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">Lacagta ($)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            min="1"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="pl-9 h-12 rounded-xl bg-slate-50 border-slate-200 hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100 font-bold text-lg"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || !amount || !phone}
                                    className={cn(
                                        "w-full h-12 rounded-xl text-white font-black uppercase tracking-widest shadow-lg transition-all active:scale-95",
                                        action === "DEPOSIT" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                                    )}
                                >
                                    {processing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <span>{action === "DEPOSIT" ? "Ku Shubo Hadda" : "Kala Bax Hadda"}</span>
                                    )}
                                </Button>
                            </form>

                            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 text-[10px] text-blue-700 leading-tight">
                                <CreditCard className="h-4 w-4 shrink-0" />
                                <p>
                                    Taxadar: Lacagta deposit-ka ahi waxay qaadanaysaa 1-5 daqiiqo in system-ka ay kasoo muuqato.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
