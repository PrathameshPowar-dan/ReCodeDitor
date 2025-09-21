import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveExecution = mutation({
    args: {
        language: v.string(),
        code: v.string(),
        output: v.optional(v.string()),
        error: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id) throw new ConvexError("Not authenticated");
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), id.subject))
            .first();

        if (!user?.isPro && args.language !== "javascript") {
            throw new ConvexError("Pro users only");
        }

        await ctx.db.insert("codeExecutions", {
            ...args,
            userId: id.subject,
        });
    }
})