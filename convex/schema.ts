import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // This gives form for the user data to be added from clerk to the database 
    users: defineTable({
        username: v.string(),
        image: v.string(),
        clerkId: v.string(),
    }).index("byClerkId", ["clerkId"]),
    messages: defineTable({
        sender: v.string(),
        content: v.string(),
    }),
})