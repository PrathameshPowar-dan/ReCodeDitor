import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSnippet = mutation({
    args: {
        title: v.string(),
        code: v.string(),
        language: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id) {
            throw new Error("Not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), id.subject))
            .first();

        if (!user) throw new Error("User not found");

        const snippetId = await ctx.db.insert("snippets", {
            userId: id.subject,
            userName: user.name,
            title: args.title,
            code: args.code,
            language: args.language,
        });
    }
});

export const getSnippets = query({
    handler: async (ctx) => {
        const snippets = await ctx.db.query("snippets").order("desc").collect();
        return snippets;
    }
});

export const isSnippetStarred = query({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id) {
            return false;
        }

        const star = await ctx.db
            .query("stars")
            .withIndex("by_snippet_and_user", (q) =>
                q.eq("snippetId", args.snippetId).eq("userId", id.subject)
            )
            .first();

        return !!star;
    }
});

export const getSnippetStarCount = query({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const stars = await ctx.db.query("stars").withIndex("by_snippet_id").filter(q => q.eq(q.field("snippetId"), args.snippetId)).collect();

        return stars.length;
    }
});

export const deleteSnippet = mutation({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id) {
            throw new Error("Not authenticated");
        };

        const snippet = await ctx.db.get(args.snippetId);
        if (!snippet) {
            throw new Error("Snippet not Found")
        };

        if (snippet.userId !== id.subject) {
            throw new Error("Not Authorized to delete this Snippet")
        };

        const comments = await ctx.db.query("snippetComments").withIndex("by_snippet_id").filter(q => q.eq(q.field("snippetId"), args.snippetId)).collect();

        for (const comment of comments) {
            await ctx.db.delete(comment._id)
        };

        const stars = await ctx.db.query("stars").withIndex("by_snippet_id").filter(q => q.eq(q.field("snippetId"), args.snippetId)).collect();

        for (const star of stars) {
            await ctx.db.delete(star._id);
        };

        await ctx.db.delete(args.snippetId);
    }
})

export const starSnippet = mutation({
    args: {
        snippetId: v.id("snippets")
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id) {
            throw new Error("Not authenticated");
        }

        const snippet = await ctx.db.get(args.snippetId);
        if (!snippet) {
            throw new Error("Snippet not found");
        }

        const existing = await ctx.db
            .query("stars")
            .withIndex("by_snippet_and_user", (q) =>
                q.eq("snippetId", args.snippetId).eq("userId", id.subject)
            )
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
            return { action: "unstarred" };
        } else {
            await ctx.db.insert("stars", {
                userId: id.subject,
                snippetId: args.snippetId
            });
            return { action: "starred" };
        }
    }
});