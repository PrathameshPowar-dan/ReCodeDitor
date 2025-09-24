"use client"

import NavigationHeader from '@/components/NavHeader';
import { useMutation, useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import SnippetsPageSkeleton from '../_components/SnippetsPageSkeleton';
import { useState, useRef, useEffect } from 'react';
import { useAuth, SignInButton, SignUpButton } from '@clerk/clerk-react';

function Snipage() {
    const snippetId = useParams().snipage;
    const router = useRouter();
    const { userId, isSignedIn } = useAuth();
    const codeRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);
    const [commentsToShow, setCommentsToShow] = useState(3);

    const snippet = useQuery(api.snippets.getSnippetById, {
        snippetId: snippetId as Id<"snippets">
    });
    const comments = useQuery(api.snippets.getComments, {
        snippetId: snippetId as Id<"snippets">
    });
    const isStarred = useQuery(api.snippets.isSnippetStarred, {
        snippetId: snippetId as Id<"snippets">
    });
    const starCount = useQuery(api.snippets.getSnippetStarCount, {
        snippetId: snippetId as Id<"snippets">
    });

    const starSnippet = useMutation(api.snippets.starSnippet);
    const addComment = useMutation(api.snippets.addComment);
    const deleteSnippet = useMutation(api.snippets.deleteSnippet);

    const [commentContent, setCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCopyCode = async () => {
        const textToCopy = snippet?.code ?? '';
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = textToCopy;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }


    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [commentContent]);

    // Load more comments
    const loadMoreComments = () => {
        setCommentsToShow(prev => prev + 3);
    };

    useEffect(() => {
        setCommentsToShow(3);
    }, [snippetId]);

    const handleStarToggle = async () => {
        if (!isSignedIn) {
            return;
        }
        try {
            await starSnippet({ snippetId: snippetId as Id<"snippets"> });
        } catch (error) {
            console.error('Error toggling star:', error);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !isSignedIn) return;

        setIsSubmittingComment(true);
        try {
            await addComment({
                snippetId: snippetId as Id<"snippets">,
                content: commentContent.trim()
            });
            setCommentContent('');
            setCommentsToShow(prev => prev + 1);
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteSnippet = async () => {
        if (!snippet || snippet.userId !== userId) return;

        if (!confirm('Are you sure you want to delete this snippet?')) return;

        setIsDeleting(true);
        try {
            await deleteSnippet({ snippetId: snippetId as Id<"snippets"> });
            router.push('/snippets');
        } catch (error) {
            console.error('Error deleting snippet:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const canDelete = snippet && snippet.userId === userId;
    const displayedComments = comments?.slice(0, commentsToShow) || [];
    const hasMoreComments = comments && comments.length > commentsToShow;

    if (snippet === undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <NavigationHeader />
                    <SnippetsPageSkeleton />
                </div>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <NavigationHeader />
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Snippet Not Found</h1>
                            <p className="text-gray-400 mb-6">The snippet you're looking for doesn't exist or has been deleted.</p>
                            <button
                                onClick={() => router.push('/snippets')}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors duration-200 transform hover:scale-105"
                            >
                                Back to Snippets
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NavigationHeader />

                {/* Back Button */}
                <button
                    onClick={() => router.push('/snippets')}
                    className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Snippets
                </button>

                {/* Snippet Header */}
                <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                                {snippet.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-gray-300">
                                <span className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    {snippet.userName}
                                </span>
                                <span className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    {new Date(snippet._creationTime).toLocaleDateString()}
                                </span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                                    {snippet.language}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleStarToggle}
                                disabled={!isSignedIn}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isStarred
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                                    : 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:border-gray-500'
                                    } ${!isSignedIn ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            >
                                <svg
                                    className={`w-5 h-5 transition-transform ${isStarred ? 'scale-110 fill-yellow-300' : 'fill-gray-400'}`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-semibold">{starCount || 0}</span>
                            </button>

                            {/* Delete Button */}
                            {canDelete && (
                                <button
                                    onClick={handleDeleteSnippet}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-600/30 disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Code Display */}
                <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Code Snippet
                        </h2>
                        <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-200 hover:scale-105 active:scale-95 min-w-[120px] justify-center"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Code
                                </>
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <pre
                            ref={codeRef}
                            className="bg-gray-900/80 rounded-xl p-6 overflow-x-auto text-sm leading-relaxed border border-gray-600/50"
                        >
                            <code className={`text-gray-100 language-${snippet.language.toLowerCase()}`}>
                                {snippet.code}
                            </code>
                        </pre>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comments {comments && (
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
                                {comments.length}
                            </span>
                        )}
                    </h2>

                    {/* Add Comment Form */}
                    {isSignedIn ? (
                        <form onSubmit={handleAddComment} className="mb-8">
                            <textarea
                                ref={textareaRef}
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Share your thoughts about this code..."
                                rows={3}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none transition-colors duration-200"
                                disabled={isSubmittingComment}
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-gray-400">
                                    {commentContent.length}/500 characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={!commentContent.trim() || isSubmittingComment}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    {isSubmittingComment ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Post Comment
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-8 p-4 bg-gray-900/30 rounded-xl text-center border border-gray-600/50">
                            <p className="text-gray-400 mb-3">Join the discussion</p>
                            <div className="flex gap-3 justify-center">
                                <SignInButton mode="modal">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </div>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {displayedComments.length > 0 ? (
                            <>
                                {displayedComments.map((comment) => (
                                    <div key={comment._id} className="bg-gray-900/30 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-colors duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                    {comment.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-white">{comment.userName}</span>
                                            </div>
                                            <span className="text-sm text-gray-400">
                                                {new Date(comment._creationTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {hasMoreComments && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={loadMoreComments}
                                            className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-200 border border-gray-600 hover:border-gray-500"
                                        >
                                            Show {Math.min(3, comments.length - commentsToShow)} more comments
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-lg mb-2">No comments yet</p>
                                <p className="text-sm">Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Snipage;