"use client";

import { ConvexReactClient, ConvexProvider } from "convex/react";

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // returns the children wrapped in the ConvexProvider, so that the children can access the Convex client and database
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
