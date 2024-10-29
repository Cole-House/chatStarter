import { mutation, query } from '../_generated/server'
import { v } from "convex/values";

export const list = query({
    //ctx varibale allows us to access the database
    // handler is the function that will be executed when the query is called
    handler: async (ctx) => {
        // return all messages from the database
        return await ctx.db.query("messages").collect();
    },
});

export const create = mutation({
    args: {
        sender: v.string(),
        content: v.string(),
    },
    handler: async (ctx, { sender, content }) => {
        // insert a new message into the database
        await ctx.db.insert("messages", { sender, content });
    }
});