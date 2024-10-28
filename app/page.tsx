"use client";

import Image from "next/image";
import { useState } from "react";
interface Message {
  sender: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Alice",
      content: "Hello, Bob!",
    },
    {
      sender: "Bob",
      content: "Hello, Alice!",
    },
  ]);
  // initialize input state
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    // prevent default form submission and use custom logic
    e.preventDefault();
    // add new message to messages
    setMessages([...messages, { sender: "Alice", content: input }]);
    // clear input
    setInput("");
  };
  return (
    <div>
      {messages.map((message, index) => (
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
  );
}
