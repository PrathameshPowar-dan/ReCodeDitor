import { useAuth } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Star } from "lucide-react";
import { useState } from "react";

function StarButton({ snippetId }: { snippetId: Id<"snippets"> }) {
    const { isSignedIn } = useAuth();

    const isStarred = useQuery(api.snippets.isSnippetStarred,
        isSignedIn ? { snippetId } : "skip"
    );

    const starCount = useQuery(api.snippets.getSnippetStarCount, { snippetId });
    const star = useMutation(api.snippets.starSnippet);
    const [isOptimistic, setIsOptimistic] = useState(false);

    const handleStar = async () => {
        if (!isSignedIn) return;

        setIsOptimistic(true);

        try {
            await star({ snippetId });
        } catch (error) {
            console.error("Error starring snippet:", error);
        } finally {
            setIsOptimistic(false);
        }
    };

    if (isOptimistic) {
        return (
            <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500"
                disabled
            >
                <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                <span className="text-xs font-medium text-yellow-500">
                    {starCount}
                </span>
            </button>
        );
    }

    const userHasStarred = !!isStarred;

    return (
        <button
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                transition-all duration-200 ${userHasStarred
                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                    : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                }`}
            onClick={handleStar}
            disabled={!isSignedIn}
            title={!isSignedIn ? "Sign in to star snippets" : userHasStarred ? "Remove star" : "Add star"}
        >
            <Star
                className={`w-4 h-4 ${userHasStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
            />
            <span className={`text-xs font-medium ${userHasStarred ? "text-yellow-500" : "text-gray-400"}`}>
                {starCount || 0}
            </span>
        </button>
    );
}

export default StarButton;