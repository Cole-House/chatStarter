"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
  AcceptedFriendsList,
  PendingFriendsList,
} from "./_components/friends-list";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function friendsPage() {
  return (
    // class flex-1 is used to make the page fill the remaining space
    <div className="flex-1 flex-col flex divide-y">
      <header className="flex items-center justify-between p-8">
        <h1 className="font-semibold">Friends</h1>
        <Button size="sm">Add Friend</Button>
      </header>
      {/* now let's create a list for pending and completed friend requests */}
      <div className="grid p-4 gap-4">
        <TooltipProvider delayDuration={0}>
          <PendingFriendsList />
          <AcceptedFriendsList />
        </TooltipProvider>
      </div>
    </div>
  );
}
