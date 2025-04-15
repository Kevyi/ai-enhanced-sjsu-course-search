"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "assistant" | "typing";
  text: string;
}

export default function AiChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [typingDots, setTypingDots] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isTyping = messages.some((msg) => msg.sender === "typing");
    if (!isTyping) return;
  
    let i = 0;
    const interval = setInterval(() => {
      setTypingDots(".".repeat((i % 3) + 1));
      i++;
    }, 500);
  
    return () => clearInterval(interval);
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed) return;
  
    setUserInput("");
  
    // Add user message first
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
  
    // Show Typing... as a separate render
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "typing", text: "Typing..." }]);
    }, 10); // Let the DOM update between state changes
  
    // Wait a little so Typing... is shown before fetch
    await new Promise((resolve) => setTimeout(resolve, 1500));
  
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: trimmed }),
      });
  
      const data = await res.json();
  
      setMessages((prev) => [
        ...prev.filter((msg) => msg.sender !== "typing"),
        { sender: "assistant", text: formatReply(data.reply) },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.sender !== "typing"),
        { sender: "assistant", text: "Something went wrong." },
      ]);
    }
  }
  

  function formatReply(raw: string): string {
    return raw
      .replace(/\*\*Course\s*\d+: (.*?)\*\*/g, (_, title) => `\n\n📘 ${title}`)
      .replace(/ - Units:/g, `\n• Units:`)
      .replace(/ - Meeting Time:/g, `\n• Meeting Time:`)
      .replace(/ - Instructor:/g, `\n• Instructor:`)
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  

  return (
    <div className="fixed bottom-8 right-8 border rounded-xl w-[900px] h-[800px] flex flex-col shadow-2xl bg-white z-50">
      <div className="px-6 py-4 border-b font-semibold text-xl">AI Chatbox</div>
  
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 font-mono text-[14px] leading-relaxed">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          const isTyping = msg.sender === "typing";
  
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`whitespace-pre-wrap break-words rounded-lg px-4 py-2 max-w-full overflow-auto ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                } ${isTyping ? "italic" : ""}`}
              >
              {isTyping ? (
                <span className="text-gray-700 italic">Typing{typingDots}</span>
              ) : (
                <pre className="overflow-x-auto whitespace-pre-wrap">{msg.text}</pre>
              )}

              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
  
      <form onSubmit={handleSendMessage} className="p-4 border-t flex space-x-2">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={1}
          placeholder="Type your message..."
          className="flex-1 border rounded-md px-4 py-3 text-base resize-none overflow-hidden bg-white"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-md text-base"
        >
          Send
        </button>
      </form>
    </div>
  );
}