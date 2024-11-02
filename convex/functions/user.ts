import { internalMutation, MutationCtx, query, QueryCtx } from "../_generated/server";
import { v } from "convex/values";

export const get = query({
    handler : async (ctx) => {
        return await getCurrentUser(ctx);
    }
})
// internal mutation to upsert a user in the database when a user is created or updated in Clerk
export const upsert = internalMutation({
  args: {
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  // hnadler is first going to look up the user by their clerkId using the withIndex helper
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
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
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await getUserByClerkId(ctx, clerkId);
    if (user) {
      await ctx.db.delete(user._id);
    } else {
      throw new Error("User not found");
    }
  },
});

const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  // we are extracting the clerkID from the identity object
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  // we are passing in the identity web token userID
  return await getUserByClerkId(ctx, identity.subject);
};

const getUserByClerkId = async (
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) => {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
};
