import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import ProPlanView from "./_components/ProPlan";
import NavigationHeader from "@/components/NavHeader";
import { ENTERPRISE_FEATURES, FEATURES } from "./_constants";
import { Beer, Zap, Shield, Clock } from "lucide-react";
import FeatureCategory from "./_components/FeatureCategory";
import FeatureItem from "./_components/FeatureItem";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import UpgradeButton from "./_components/UpgradeButton";
import LoginButton from "@/components/LoginButton";

async function page() {
    const user = await currentUser();
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const convexUser = await convex.query(api.users.getUser, {
        userId: user?.id || ""
    })

    if (convexUser?.isPro) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                <div className="max-w-[1800px] mx-auto p-4">
                    <NavigationHeader />
                    <ProPlanView />
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
            <div className="max-w-[1800px] mx-auto p-4">
                <NavigationHeader />
                <main className="relative pt-24 pb-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                                <Zap className="w-5 h-5 text-blue-400" />
                                <span className="text-blue-400 font-medium">Pro Plan Available</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Upgrade Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Workflow</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                Professional tools for serious developers. Ship better code, faster.
                            </p>
                        </div>

                        {/* Value Propositions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">10x Faster</h3>
                                <p className="text-gray-400">Priority execution and faster processing</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No Limits</h3>
                                <p className="text-gray-400">Unlimited storage and executions</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Lifetime Access</h3>
                                <p className="text-gray-400">One-time payment, forever updates</p>
                            </div>
                        </div>

                        {/* Enterprise Features */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {ENTERPRISE_FEATURES.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="group bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                        <feature.icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.label}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Card */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl border border-gray-700/50 p-8">
                                <div className="text-center mb-8">
                                    <div className="inline-flex p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                                        <Beer className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Lifetime Pro Access</h2>
                                    <div className="flex flex-col items-center justify-center gap-2 mb-2">
                                        <p className="text-2xl text-gray-400">For</p>
                                        <p className="text-5xl font-bold text-white">₹51</p>
                                    </div>
                                    <p className="text-gray-400">Unlock all pro features forever</p>
                                </div>

                                {/* Features Grid */}
                                <div className="grid md:grid-cols-3 gap-8 mb-8">
                                    <FeatureCategory label="Development">
                                        {FEATURES.development.map((feature, idx) => (
                                            <FeatureItem key={idx}>{feature}</FeatureItem>
                                        ))}
                                    </FeatureCategory>

                                    <FeatureCategory label="Collaboration">
                                        {FEATURES.collaboration.map((feature, idx) => (
                                            <FeatureItem key={idx}>{feature}</FeatureItem>
                                        ))}
                                    </FeatureCategory>

                                    <FeatureCategory label="Deployment">
                                        {FEATURES.deployment.map((feature, idx) => (
                                            <FeatureItem key={idx}>{feature}</FeatureItem>
                                        ))}
                                    </FeatureCategory>
                                </div>

                                {/* Guarantee */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                                        <Shield className="w-4 h-4 text-green-400" />
                                        <span>30-day money-back guarantee</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex justify-center">
                                    <SignedIn>
                                        <UpgradeButton />
                                    </SignedIn>
                                    <SignedOut>
                                        <LoginButton />
                                    </SignedOut>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default page