"use client"
import { useMutation, useQuery } from "convex/react"
import NavigationHeader from "@/components/NavHeader";
import { api } from "../../../convex/_generated/api"
import { useState } from "react";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";
import { BookOpen, Grid, Layers, Search, Tag, X, Code, User, Calendar, Copy, Star, StarIcon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Id } from "../../../convex/_generated/dataModel";

function Page() {
    const { user } = useUser();
    const snippets = useQuery(api.snippets.getSnippets);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");
    const deleteSnippet = useMutation(api.snippets.deleteSnippet);
    const [deletingId, setDeletingId] = useState<string | null>(null);


    if (snippets === undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                <div className="max-w-[1800px] mx-auto p-4">
                    <NavigationHeader />
                    <SnippetsPageSkeleton />
                </div>
            </div>
        )
    }

    const languages = [...new Set(snippets.map(s => s.language))].sort();
    const popularLanguages = languages.slice(0, 6);

    const filteredSnippets = snippets.filter(snip => {
        const matches =
            snip.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
            snip.language.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
            snip.userName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase());

        const matchesLANG = !selectedLanguage || snip.language === selectedLanguage;

        return matches && matchesLANG
    })

    const handleDelete = async (snippetId: Id<"snippets">) => {
        setDeletingId(snippetId);

        try {
            await deleteSnippet({ snippetId });
            toast.success("Snippet deleted");
        } catch (error) {
            console.log("Error deleting snippet:", error);
            toast.error("Error deleting snippet");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
            <div className="max-w-[1800px] mx-auto p-4">
                <NavigationHeader />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto mb-16 mt-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r
                        from-orange-500/10 to-green-500/10 border border-orange-500/20 text-sm text-orange-300 mb-6"
                    >
                        <BookOpen className="w-4 h-4" />
                        Community Code Library
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 text-transparent bg-clip-text mb-6"
                    >
                        ReCodeDitor Snippets
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 mb-8 leading-relaxed"
                    >
                        Discover, share, and collaborate with the community's best code examples
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-6xl mx-auto mb-12 space-y-6"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-green-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-orange-400 z-10" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, language, or author..."
                                className="w-full pl-12 pr-6 py-4 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900 text-white
                                rounded-2xl border border-gray-800 hover:border-orange-500/30 transition-all duration-300
                                placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50
                                text-lg shadow-2xl"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded-xl border border-gray-800">
                                <Tag className="w-4 h-4 text-orange-400" />
                                <span className="text-sm text-gray-300">Languages:</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {popularLanguages.map((lang) => (
                                    <motion.button
                                        key={lang}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedLanguage(lang === selectedLanguage ? null : lang)}
                                        className={`
                                            group relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2
                                            ${selectedLanguage === lang
                                                ? "text-white bg-gradient-to-r from-orange-500/20 to-green-500/20 border border-orange-500/50 shadow-lg"
                                                : "text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/30"
                                            }
                                        `}
                                    >
                                        <img
                                            src={`/${lang}.png`}
                                            alt={lang}
                                            className="w-5 h-5 object-contain filter brightness-125"
                                        />
                                        <span className="text-sm font-medium">{lang}</span>
                                        {selectedLanguage === lang && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-2 h-2 bg-green-400 rounded-full"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {selectedLanguage && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setSelectedLanguage(null)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-orange-400 
                                    hover:bg-gray-800/50 rounded-xl border border-gray-800 transition-all duration-200"
                                >
                                    <X className="w-4 h-4" />
                                    Clear filter
                                </motion.button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.span
                                className="text-sm text-gray-400 font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {filteredSnippets.length} {filteredSnippets.length === 1 ? 'snippet' : 'snippets'} found
                            </motion.span>

                            <div className="items-center hidden md:flex gap-1 p-1 bg-gray-900/50 rounded-xl border border-gray-800">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setView("grid")}
                                    className={`p-2 rounded-lg transition-all duration-200 ${view === "grid"
                                        ? "text-orange-400 bg-orange-500/20 shadow-md"
                                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setView("list")}
                                    className={`p-2 rounded-lg transition-all duration-200 ${view === "list"
                                        ? "text-orange-400 bg-orange-500/20 shadow-md"
                                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                                        }`}
                                >
                                    <Layers className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-6xl mx-auto"
                >
                    <AnimatePresence mode="wait">
                        {filteredSnippets.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-16"
                            >
                                <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl text-gray-400 mb-2">No snippets found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className={`
                                    ${view === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                        : "space-y-4"
                                    }
                                `}
                            >
                                {filteredSnippets.map((snippet, index) => (
                                    <Link
                                        href={`/snippets/${snippet._id}`}
                                        key={snippet._id}
                                        className={`
                                            group rounded-2xl border transition-all duration-300 overflow-hidden
                                            ${view === "grid"
                                                ? "bg-gradient-to-br from-gray-900/50 to-gray-950/50 border-gray-800 hover:border-orange-500/30 p-6"
                                                : "bg-gray-900/30 border-gray-800 hover:border-orange-300/20 p-6"
                                            }
                                        `}
                                    >
                                        <div className="bg-gradient-to-r from-orange-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={`/${snippet.language}.png`}
                                                    alt={snippet.language}
                                                    className="w-6 h-6 object-contain"
                                                />
                                                <span className="text-sm font-medium text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">
                                                    {snippet.language}
                                                </span>
                                            </div>

                                            <div>
                                                <StarIcon className="w-4 h-4 text-gray-500" />
                                            </div>

                                        </div>

                                        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                                            {snippet.title}
                                        </h3>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Code Preview</span>
                                            </div>
                                            <div className="bg-gray-950/80 border border-gray-800 rounded-lg p-3 relative group/code">
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-green-500/5 rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity" />
                                                <pre className="text-xs text-gray-300 font-mono relative z-10 overflow-hidden">
                                                    <code className="line-clamp-4">
                                                        {snippet.code || "// No code provided"}
                                                    </code>
                                                </pre>
                                                <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-gray-950/80 to-transparent pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <User className="w-4 h-4" />
                                                {snippet.userName}
                                            </div>
                                            {user?.id === snippet.userId && (
                                                <div className="z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            void handleDelete(snippet._id);
                                                        }}
                                                        disabled={deletingId === String(snippet._id)}
                                                        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${deletingId === String(snippet._id) ? "bg-red-500/20 text-red-400 cursor-not-allowed" : "bg-red-500 text-gray-100 hover:bg-red-500/10 hover:text-red-400"}`}>
                                                        {deletingId === String(snippet._id) ? (
                                                            <div className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                        ) : (
                                                            <Trash2 className="size-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}

export default Page