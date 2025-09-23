"use client"
import { useQuery } from "convex/react"
import NavigationHeader from "@/components/NavHeader";
import { api } from "../../../convex/_generated/api"
import { useState } from "react";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";

function page() {
    const snippets = useQuery(api.snippets.getSnippets);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setselectedLanguage] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");

    if (snippets === undefined) {
        return (
            <div className="min-h-screen">
                <div className="max-w-[1800px] mx-auto p-4">
                    <NavigationHeader />

                </div>
            </div>
        )
    }
    return (
        <>
            <div className="min-h-screen">
                <div className="max-w-[1800px] mx-auto p-4">
                    <NavigationHeader />
                    <SnippetsPageSkeleton/>
                </div>
            </div>
        </>
    )
}

export default page
