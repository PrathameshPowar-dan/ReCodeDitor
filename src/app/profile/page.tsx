"use client"

import NavigationHeader from '@/components/NavHeader';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '../../../convex/_generated/api';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import {
    Zap,
    Code2,
    Star,
    BarChart3,
    Play,
    FileCode,
    User,
    Mail,
    Calendar,
    Languages,
    Crown,
    Sparkles,
    Plus,
    Home,
    ChevronRight
} from 'lucide-react';

function ProfilePage() {
    const router = useRouter();
    const { userId, isSignedIn } = useAuth();
    const { user } = useUser();

    const [activeTab, setActiveTab] = useState<'stats' | 'executions' | 'snippets'>('stats');

    const userStats = useQuery(api.codeExecutions.getUserStats,
        userId ? { userId } : "skip"
    );

    const { results: executions, status: executionsStatus, loadMore } = usePaginatedQuery(
        api.codeExecutions.getUserExecution,
        {
            userId: user?.id ?? "",
        },
        { initialNumItems: 5 }
    );

    const userSnippets = useQuery(api.snippets.getSnippets);
    const currentUserSnippets = userSnippets?.filter(snippet => snippet.userId === userId) || [];

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <NavigationHeader />
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
                            <p className="text-gray-400 mb-6">Please sign in to view your profile</p>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
                <NavigationHeader />

                {/* Profile Header */}
                <div className="bg-gray-800/50 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                                {user?.fullName || user?.username || 'User'}
                            </h1>
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                                <StatBadge
                                    icon={Zap}
                                    value={userStats?.totalExecutions || 0}
                                    label="Executions"
                                    color="blue"
                                />
                                <StatBadge
                                    icon={FileCode}
                                    value={currentUserSnippets.length}
                                    label="Snippets"
                                    color="green"
                                />
                                <StatBadge
                                    icon={Star}
                                    value={0}
                                    label="Starred"
                                    color="yellow"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-800/50 rounded-2xl p-1 sm:p-2 mb-6 sm:mb-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex space-x-1">
                        {[
                            { id: 'stats' as const, label: 'Statistics', icon: BarChart3 },
                            { id: 'executions' as const, label: 'Executions', icon: Play },
                            { id: 'snippets' as const, label: 'Snippets', icon: Code2 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 flex-1 text-center text-sm sm:text-base ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 bg-gray-800/50 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium hidden md:block xs:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-gray-800/50 rounded-2xl p-4 sm:p-6 border border-gray-700/50 backdrop-blur-sm">
                    {/* Statistics Tab */}
                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Coding Statistics
                                </h2>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                <StatCard
                                    icon={Zap}
                                    label="Total Executions"
                                    value={userStats?.totalExecutions || 0}
                                    color="blue"
                                />
                                <StatCard
                                    icon={Languages}
                                    label="Languages Used"
                                    value={userStats?.languagesCount || 0}
                                    color="green"
                                />
                                <StatCard
                                    icon={Crown}
                                    label="Favorite Language"
                                    value={userStats?.favoriteLanguage || 'N/A'}
                                    color="yellow"
                                />
                                <StatCard
                                    icon={Sparkles}
                                    label="Most Starred"
                                    value={userStats?.mostStarredLanguage || 'N/A'}
                                    color="purple"
                                />
                            </div>

                            {/* Language Distribution */}
                            {userStats?.languageStats && Object.keys(userStats.languageStats).length > 0 && (
                                <div className="bg-gray-900/30 rounded-xl p-4 sm:p-6 border border-gray-600/30">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Languages className="w-5 h-5" />
                                        Language Distribution
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(userStats.languageStats)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([lang, count]) => (
                                                <div key={lang} className="flex items-center justify-between">
                                                    <span className="text-gray-300 font-medium text-sm sm:text-base">{lang}</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-20 sm:w-32 bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${(count / userStats.totalExecutions) * 100}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-400 text-xs sm:text-sm w-6 sm:w-8 text-right">
                                                            {count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Executions Tab */}
                    {activeTab === 'executions' && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                                Recent Code Executions
                            </h2>
                            {executions?.length === 0 ? (
                                <EmptyState
                                    icon={Play}
                                    title="No executions yet"
                                    description="Start coding to see your execution history!"
                                    actionLabel="Start Coding"
                                    onAction={() => router.push('/')}
                                />
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {executions?.map((execution) => (
                                        <ExecutionCard key={execution._id} execution={execution} />
                                    ))}
                                    {executionsStatus === "CanLoadMore" && (
                                        <div className="flex justify-center pt-4">
                                            <button
                                                onClick={() => loadMore(5)}
                                                className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-200 border border-gray-600 hover:border-gray-500 flex items-center gap-2"
                                            >
                                                Load More
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Snippets Tab */}
                    {activeTab === 'snippets' && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                My Code Snippets
                            </h2>
                            {currentUserSnippets.length === 0 ? (
                                <EmptyState
                                    icon={FileCode}
                                    title="No snippets created yet"
                                    description="Share your first code snippet with the community!"
                                    actionLabel="Create Snippet"
                                    onAction={() => router.push('/')}
                                />
                            ) : (
                                <div className="grid gap-3 sm:gap-4">
                                    {currentUserSnippets.map((snippet) => (
                                        <SnippetCard key={snippet._id} snippet={snippet} onClick={() => router.push(`/snippets/${snippet._id}`)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatBadge({ icon: Icon, value, label, color }: { icon: any; value: number; label: string; color: string }) {
    const colorClasses = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        yellow: 'text-yellow-400',
        purple: 'text-purple-400',
    };

    return (
        <div className="flex items-center gap-1.5 bg-gray-700/50 px-2.5 py-1.5 rounded-full border border-gray-600/50">
            <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses[color as keyof typeof colorClasses]}`} />
            <span className="text-xs sm:text-sm text-gray-300 font-medium">
                {value} {label}
            </span>
        </div>
    );
}

// Component: Stat Card
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
        purple: 'from-purple-500 to-purple-600',
    };

    return (
        <div className="bg-gray-900/30 rounded-xl p-4 sm:p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">{label}</p>
                    <p className="text-white text-lg sm:text-2xl font-bold truncate">{value}</p>
                </div>
            </div>
        </div>
    );
}

// Component: Execution Card
function ExecutionCard({ execution }: { execution: any }) {
    return (
        <div className="bg-gray-900/30 rounded-xl p-3 sm:p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 group cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                        {execution.language}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(execution._creationTime).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <pre className="text-xs sm:text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed">
                {execution.code.slice(0, 150)}...
            </pre>
            {execution.output && (
                <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="text-xs text-green-300 font-mono">Output: {execution.output}</span>
                </div>
            )}
            {execution.error && (
                <div className="mt-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <span className="text-xs text-red-300 font-mono">Error: {execution.error}</span>
                </div>
            )}
        </div>
    );
}

// Component: Snippet Card
function SnippetCard({ snippet, onClick }: { snippet: any; onClick: () => void }) {
    return (
        <div
            className="bg-gray-900/30 rounded-xl p-3 sm:p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 group cursor-pointer hover:scale-[1.01]"
            onClick={onClick}
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                    {snippet.title}
                </h3>
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30 shrink-0">
                    {snippet.language}
                </span>
            </div>
            <pre className="text-xs sm:text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed mb-3">
                {snippet.code.slice(0, 120)}...
            </pre>
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(snippet._creationTime).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>0</span>
                </div>
            </div>
        </div>
    );
}

// Component: Empty State
function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: { icon: any; title: string; description: string; actionLabel: string; onAction: () => void }) {
    return (
        <div className="text-center py-8 sm:py-12 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-600/30">
                <Icon className="w-8 h-8 opacity-60" />
            </div>
            <p className="text-lg font-medium mb-2">{title}</p>
            <p className="text-sm mb-4 max-w-sm mx-auto">{description}</p>
            <button
                onClick={onAction}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
                <Plus className="w-4 h-4" />
                {actionLabel}
            </button>
        </div>
    );
}

export default ProfilePage;