"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Trash2 } from "lucide-react";
import { Season } from "@/lib/sjsu/types";

interface Message {
  sender: "user" | "assistant" | "typing";
  text: string;
}

interface ContextState {
  university?: string;
  semester?: string;
  lastCourseCode?: string;
}

interface AiChatBoxProps {
  selectedSemester: {
    season: Season;
    year: number;
  }
}

export default function AiChatBox({ selectedSemester }: AiChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("chatMessages");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [context, setContext] = useState<ContextState>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("chatContext");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const [userInput, setUserInput] = useState("");
  const [typingDots, setTypingDots] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("chatContext", JSON.stringify(context));
  }, [context]);

  const clearChat = () => {
    setMessages([]);
    setContext({});
    sessionStorage.removeItem("chatMessages");
    sessionStorage.removeItem("chatContext");
  };

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed) return;

    setUserInput("");
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "typing", text: "Typing..." }]);
    }, 10);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: trimmed,
          context,
          season: selectedSemester.season,
          year: selectedSemester.year 
        }),
      });

      const data = await res.json();

      // Update context with the new context from the response
      if (data.context) {
        setContext(data.context);
      }

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
      .replace(/\*\*Course\s*\d+: (.*?)\*\*/g, (_, title) => `\n\n\ud83d\udcd8 ${title}`)
      .replace(/ - Units:/g, `\n\u2022 Units:`)
      .replace(/ - Meeting Time:/g, `\n\u2022 Meeting Time:`)
      .replace(/ - Instructor:/g, `\n\u2022 Instructor:`)
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI Chatbox</h2>
            <div className="flex space-x-2">
              <button
                onClick={clearChat}
                className="text-gray-500 hover:text-gray-700 p-1"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

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
                      isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                    } ${isTyping ? "italic" : ""}`}
                  >
                    {isTyping ? (
                      <span className="text-gray-700 italic">Typing{typingDots}</span>
                    ) : (
                      <pre className="overflow-x-auto whitespace-pre-wrap">
                        {msg.text}
                      </pre>
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
      )}
    </div>
  );
}