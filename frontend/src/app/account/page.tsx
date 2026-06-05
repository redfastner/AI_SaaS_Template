"use client";

import React, { useState, useEffect } from "react";
import { SafeComponent } from "@/components/SafeComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Loader2, ArrowRight, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AccountPage() {
    const supabase = createClient();
    const router = useRouter();
    const { user, setUser, session, checkSession, isLoading: userLoading, refreshCredits, credits: userStoreCredits } = useUserStore();

    useEffect(() => {
        checkSession();
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup State
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [agreedTerms, setAgreedTerms] = useState(false);

    // Constants
    // SECURITY: Price IDs MUST be set via environment variables.
    // No hardcoded fallbacks — missing vars will surface as a visible error
    // rather than silently falling back to real production IDs.
    const PRICING_TIERS = [
        {
            id: "starter",
            name: "Starter",
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
            price: "$20",
            credits: 100,
            description: "One-time payment"
        },
        {
            id: "pro",
            name: "Pro",
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "",
            price: "$40",
            credits: 225,
            description: "One-time payment"
        },
        {
            id: "heavy",
            name: "Heavy",
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HEAVY ?? "",
            price: "$60",
            credits: 350,
            description: "One-time payment"
        }
    ];

    useEffect(() => {
        // Clear errors when switching or loading
        setError(null);
        setSuccessMsg(null);
    }, [user]);

    const [stats, setStats] = useState({ scene_generations: 0, ad_generations: 0 });

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        if (session?.access_token) {
            fetch(`${apiUrl}/api/stats/user_stats`, {
                headers: { "Authorization": `Bearer ${session.access_token}` }
            })
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(err => console.error("Failed to fetch stats", err));
        }
    }, [session]);

    const handleBuyCredits = async (priceId: string, creditAmount: number) => {
        if (!session?.access_token) {
            alert("Please log in to buy credits.");
            return;
        }
        if (!priceId) {
            alert("Billing is not configured. Please contact support.");
            return;
        }
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/payment/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    price_id: priceId,
                    credits: creditAmount
                })
            });
            const data = await res.json();
            if (data.url) {
                // SECURITY: Do not log checkout URLs — they contain session tokens.
                window.location.href = data.url;
            } else {
                alert("Failed to initiate checkout. Please try again.");
            }
        } catch (e) {
            alert("Error initiating payment. Please try again.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (error) throw error;

            if (data.user) {
                // Update Store
                setUser(data.user);
                await refreshCredits(); // Fetch credits immediately
                // router.push("/creator-studio/hyper-influencer"); // REMOVED REDIRECT
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (signupPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (signupPassword !== retypePassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!agreedTerms) {
            setError("You must agree to the terms.");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: signupEmail,
                password: signupPassword,
                options: {
                    // Optional: Redirect to valid URL after email confirmation if enabled
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) throw error;

            if (data.user) {
                setSuccessMsg("Account created! Please check your email to verify your account, or sign in if verification is disabled.");
                // If auto-sign-in is enabled in Supabase, we might already be logged in:
                if (data.session) {
                    setUser(data.user);
                    // router.push("/creator-studio/hyper-influencer"); // REMOVED REDIRECT
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
            router.push("/");
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER: LOADING STATE ---
    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-(--background)">
                <Loader2 className="w-8 h-8 animate-spin text-(--foreground)" />
            </div>
        );
    }

    // --- RENDER: LOGGED IN VIEW ---
    if (user) {
        return (
            <SafeComponent name="AccountPageRequest">
                <div className="min-h-screen flex flex-col items-center justify-start pt-24 md:pt-32 p-4 md:p-8 space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-8xl font-light tracking-[-0.07em] uppercase leading-none text-(--foreground)">
                            PROFILE
                        </h1>
                        <p className="uppercase text-[10px] font-bold tracking-[0.25em] max-w-2xl mx-auto leading-relaxed text-(--foreground) opacity-70">
                            Manage your account and settings.
                        </p>
                    </div>


                    {/* PRICING SECTION */}
                    <div className="w-full max-w-5xl space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Add Credits</h2>
                            <p className="text-stone-500">One-time payments. No subscriptions.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {PRICING_TIERS.map((tier) => (
                                <div key={tier.id} className="border-2 border-stone-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-6 flex flex-col items-center text-center hover:border-stone-900 dark:hover:border-stone-100 transition-colors cursor-pointer group">
                                    <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">{tier.name}</div>
                                    <div className="text-3xl font-black mb-1">{tier.price}</div>
                                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4">{tier.credits} Credits</div>

                                    <p className="text-[10px] text-stone-400 mb-6 leading-relaxed">
                                        {tier.description}
                                    </p>

                                    <Button
                                        className="w-full h-9 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] bg-stone-100 text-stone-900 group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors cursor-pointer"
                                        onClick={() => handleBuyCredits(tier.priceId, tier.credits)}
                                    >
                                        Select
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl items-stretch">

                        {/* USAGE HISTORY BOX */}
                        <div className="flex-1 p-8 border-2 border-(--border-color) bg-(--background) rounded-3xl shadow-sm space-y-6 flex flex-col justify-center text-center">
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Credits Balance</h3>
                                <p className="text-4xl font-black text-(--foreground)">
                                    {userStoreCredits !== undefined ? userStoreCredits : 0} <span className="text-sm font-bold text-stone-400">Credits</span>
                                </p>
                            </div>

                            <div className="pt-6 border-t border-stone-100 dark:border-zinc-800 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">Usage History</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-stone-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                                        <span className="block text-2xl font-bold text-(--foreground)">{stats.scene_generations}</span>
                                        <span className="text-[10px] font-bold uppercase text-stone-400">Scene Gens</span>
                                    </div>
                                    <div className="bg-stone-50 dark:bg-zinc-900/50 p-4 rounded-xl">
                                        <span className="block text-2xl font-bold text-(--foreground)">{stats.ad_generations}</span>
                                        <span className="text-[10px] font-bold uppercase text-stone-400">Ad Gens</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PROFILE BOX */}
                        <div className="flex-1 p-8 border-2 border-(--border-color) bg-(--background) rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-stone-200">
                                    {user.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                            <User className="w-8 h-8 text-stone-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h2 className="text-lg font-bold">{user.email}</h2>
                                    <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mt-1">
                                        Account Active
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                                Sign Out
                            </Button>
                        </div>
                    </div>

                </div>
            </SafeComponent>
        );
    }

    // --- RENDER: AUTH FORMS ---
    return (
        <SafeComponent name="AccountPage">
            <div className="min-h-screen flex flex-col items-center justify-start pt-24 md:pt-32 p-4 md:p-8">

                {/* Header Section (Matches Blog Style) */}
                <div className="mb-12 text-center space-y-4">
                    <h1 className="text-5xl md:text-8xl font-light tracking-[-0.07em] uppercase leading-none text-(--foreground)">
                        ACCOUNT
                    </h1>
                    <p className="uppercase text-[10px] font-bold tracking-[0.25em] max-w-2xl mx-auto leading-relaxed text-(--foreground) opacity-70">
                        Secure Access To Your Viral Diffusion Dashboard.
                    </p>
                </div>

                {/* Main Card (Matches Blog List Item Style) */}
                <div className="w-full max-w-md">
                    <div className="p-8 border-2 border-(--border-color) bg-(--background) rounded-3xl shadow-sm">

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-(--secondary) rounded-xl">
                                <TabsTrigger
                                    value="login"
                                    className="rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer data-[state=active]:bg-(--background) data-[state=active]:text-(--foreground) data-[state=active]:shadow-sm"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    value="signup"
                                    className="rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer data-[state=active]:bg-(--background) data-[state=active]:text-(--foreground) data-[state=active]:shadow-sm"
                                >
                                    Sign Up
                                </TabsTrigger>
                            </TabsList>

                            {error && (
                                <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-xs font-bold text-red-500 border border-red-500/20">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {successMsg && (
                                <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-500/10 p-4 text-xs font-bold text-green-600 border border-green-500/20">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>{successMsg}</span>
                                </div>
                            )}

                            <TabsContent value="login" className="animate-in fade-in zoom-in-95 duration-200">
                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--foreground) opacity-60">Email Address</Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="h-12 bg-transparent border-2 border-(--border-color) rounded-xl focus:border-(--foreground) focus:ring-0 text-sm font-medium"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--foreground) opacity-60">Password</Label>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--foreground) opacity-40 cursor-pointer hover:opacity-100 transition-opacity">Forgot?</span>
                                        </div>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            className="h-12 bg-transparent border-2 border-(--border-color) rounded-xl focus:border-(--foreground) focus:ring-0 text-sm font-medium"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-[0.2em] bg-(--foreground) text-(--background) hover:opacity-90 transition-opacity" type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" className="animate-in fade-in zoom-in-95 duration-200">
                                <form onSubmit={handleSignup} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--foreground) opacity-60">Email Address</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="h-12 bg-transparent border-2 border-(--border-color) rounded-xl focus:border-(--foreground) focus:ring-0 text-sm font-medium"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--foreground) opacity-60">Create Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            className="h-12 bg-transparent border-2 border-(--border-color) rounded-xl focus:border-(--foreground) focus:ring-0 text-sm font-medium"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="retype-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--foreground) opacity-60">Confirm Password</Label>
                                        <Input
                                            id="retype-password"
                                            type="password"
                                            className="h-12 bg-transparent border-2 border-(--border-color) rounded-xl focus:border-(--foreground) focus:ring-0 text-sm font-medium"
                                            value={retypePassword}
                                            onChange={(e) => setRetypePassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-start space-x-3 py-2">
                                        <Checkbox
                                            id="terms"
                                            checked={agreedTerms}
                                            onCheckedChange={(checked) => setAgreedTerms(!!checked)}
                                            className="mt-1 border-2 border-(--border-color) data-[state=checked]:bg-(--foreground) data-[state=checked]:text-(--background)"
                                        />
                                        <Label
                                            htmlFor="terms"
                                            className="text-xs font-medium text-(--foreground) opacity-70 leading-tight cursor-pointer"
                                        >
                                            I agree to the <a href="/terms" className="underline font-bold text-(--foreground) hover:opacity-100">Terms of Service</a>
                                        </Label>
                                    </div>
                                    <Button className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-[0.2em] bg-(--foreground) text-(--background) hover:opacity-90 transition-opacity" type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </SafeComponent>
    );
}
