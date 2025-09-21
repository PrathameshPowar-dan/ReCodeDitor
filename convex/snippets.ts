import { v } from "convex/values";
import { mutation } from "./_generated/server";

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