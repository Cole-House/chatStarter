"use client";

import { api } from "@/convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { useState } from "react";

export default function Home() {
  const messages = useQuery(api.functions.message.list);
  const createMessage = useMutation(api.functions.message.create);
  // initialize input state
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    // prevent default form submission and use custom logic
    e.preventDefault();
    // add new message to messages
    createMessage({ sender: "user", content: input });
    // clear input
    setInput("");
  };
  return (
    <>
      <Authenticated>
        <div>
          {messages?.map((message, index) => (
            // will later be indexed by data
            <div key={index}>
              <strong>{message.sender}:</strong>
              <p> {message.content}</p>
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            {/* setting the input to change the message displayed*/}
            <input
              type="text"
              name="message"
              id="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit"> Send </button>
          </form>
        </div>        
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
