import { error } from "console";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { s } from "framer-motion/client";
import { Languages } from "lucide-react";

export default defineSchema({
    users: defineTable({
        userId: v.string(),
        email: v.string(),
        name: v.string(),
        isPro: v.boolean(),
        proSince: v.optional(v.number()),
        lemonSqueezyCustomerId: v.optional(v.string()),
        lemonSqueezyOrderId: v.optional(v.string()),
    }).index("by_user_id", ["userId"]),

    codeExecutions: defineTable({
        userId: v.string(),
        code: v.string(),
        language: v.string(),
        output: v.optional(v.string()),
        error: v.optional(v.string()),
    }).index("by_user_id", ["userId"]),

    snippets: defineTable({
        userId: v.string(),
        title: v.string(),
        code: v.string(),
        language: v.string(),
        userName: v.string(),
    }).index("by_user_id", ["userId"]),

    snippetComments: defineTable({
        snippetId: v.id("snippets"),
        userId: v.string(),
        userName: v.string(),
        content: v.string()
    }).index("by_snippet_id", ["snippetId"]),

    stars: defineTable({
        snippetId: v.id("snippets"),
        userId: v.id("users"),
    })
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id", ["userId"])
    .index("by_snippet_and_user", ["snippetId", "userId"])
});