import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// HTTP action endpoint that acts as a webhook for Clerk
http.route({
  method: "POST",
  path: "/clerk-webhook",
  handler: httpAction(async (ctx, req) => {
    const body = await validateRequest(req);
    if (!body) {
      return new Response("Unauthorized", { status: 401 });
    }
    // switch statement to handle different webhook event types from Clerk
    switch (body.type) {
      case "user.created":
        // upsert the user in the database when a user is created in Clerk
        await ctx.runMutation(internal.functions.user.upsert, {
          username: body.data.username!,
          image: body.data.image_url,
          clerkId: body.data.id,
        });
        break;
      case "user.updated":
        await ctx.runMutation(internal.functions.user.upsert, {
          username: body.data.username!,
          image: body.data.image_url,
          clerkId: body.data.id,
        });
        break;
      case "user.deleted":
        if (body.data.id) {
          await ctx.runMutation(internal.functions.user.remove, {
            clerkId: body.data.id,
          });
        }
        break;
    }
    return new Response("OK", { status: 200 });
  }),
});

// going to need to look at some request headers and content to validate the request
const validateRequest = async (req: Request) => {
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  const text = await req.text();
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    return webhook.verify(text, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as unknown as WebhookEvent;
  } catch (e) {
    return null;
  }
};

export default http;
