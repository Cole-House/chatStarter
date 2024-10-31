import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
// internal mutation to upsert a user in the database when a user is created or updated in Clerk
export const upsert = internalMutation({
  args: {
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  // hnadler is first going to look up the user by their clerkId using the withIndex helper
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    // if the user exists, patch the user with the new username and image and if the user does not exist, insert a new user with the username, image, and clerkId
    if (user) {
      await ctx.db.patch(user._id, {
        username: args.username,
        image: args.image,
      });
    } else {
      await ctx.db.insert("users", {
        username: args.username,
        image: args.image,
        clerkId: args.clerkId,
      });
    }
  },
});

export const remove = internalMutation({
    args: {clerkId: v.string()},
    handler: async (ctx, { clerkId }) => { 
        const user = await ctx.db
        .query("users")
        .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
        .unique();

        if (user) {
            await ctx.db.delete(user._id);
        } else {
            throw new Error("User not found");
        }
    }
});

