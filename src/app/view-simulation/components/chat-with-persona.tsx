"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat, type Message } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { ChatWithPersonaProps } from "../types";

export function ChatWithPersona({ persona, onClose }: ChatWithPersonaProps) {
  // Generate a unique chat ID based on the persona name
  const chatId = `persona-chat-${persona.name.toLowerCase().replace(/\s+/g, "-")}`;

  // State to track if we're in initial loading phase (before streaming starts)
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initialize chat functionality with the AI SDK
  const { messages, input, setInput, append, isLoading, error } = useChat({
    id: chatId,
    api: "/api/chat",
    initialMessages: [],
    body: {
      persona: persona,
    },
    // Load chat history from localStorage if it exists
    onFinish: (message) => {
      const chatHistory = [...messages, message];
      localStorage.setItem(chatId, JSON.stringify(chatHistory));
    },
  });

  // Message container ref for auto-scrolling
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount - with no local message generation
  useEffect(() => {
    try {
      // First, check if there might be corrupted data and clear it
      try {
        const savedData = localStorage.getItem(chatId);
        if (savedData) {
          // Try to parse it to verify it's valid
          JSON.parse(savedData);
        }
      } catch (parseError) {
        // If there's any error parsing, clear this potentially corrupt data
        console.warn("Found corrupt chat history, clearing it:", parseError);
        localStorage.removeItem(chatId);
      }

      // Now try to load valid data
      const savedMessages = localStorage.getItem(chatId);
      if (savedMessages && messages.length === 0) {
        const parsedMessages = JSON.parse(savedMessages) as Message[];
        // Only load saved messages if we have them and our current messages array is empty
        if (parsedMessages.length > 0) {
          // Simply load existing messages - no greeting or additional messages
          parsedMessages.forEach((msg) => {
            append(msg);
          });
        }
      }
      // Don't add any initial messages - wait for the user to start the conversation
    } catch (error) {
      console.error("Error loading chat history:", error);
      // If any error occurs with localStorage, clear it to start fresh
      localStorage.removeItem(chatId);
    }
  }, [chatId, messages, append]);

  // Send an initial "Hello" message to trigger the AI to introduce itself
  useEffect(() => {
    // Only send the introduction message if there are no messages yet
    if (messages.length === 0) {
      // Send the "Hello" message to the API to trigger persona introduction
      append({
        content: "Hello",
        role: "user",
      });
    }
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  // Auto-scroll to bottom when new messages arrive with smooth animation
  useEffect(() => {
    if (messageContainerRef.current) {
      // Add smooth scrolling behavior
      messageContainerRef.current.style.scrollBehavior = "smooth";
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = useCallback(() => {
    if (input.trim() && !isLoading) {
      append({ content: input, role: "user" });
      setInput("");
    }
  }, [input, isLoading, append, setInput]);

  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="py-6 px-6 space-y-4 ChatWithPersona">
      {/* Chat history */}
      <div
        ref={messageContainerRef}
        className="border border-slate-200 rounded-md p-4 h-[320px] overflow-y-auto flex flex-col space-y-4 bg-slate-50 shadow-inner"
      >
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 animate-fade-in ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role !== "user" && (
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {persona.name.charAt(0)}
              </div>
            )}

            <div
              className={`p-3 rounded-lg max-w-[85%] relative ${
                message.role === "user"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-white shadow-sm border border-slate-200 text-slate-700"
              }`}
            >
              <div
                className={`absolute ${
                  message.role === "user"
                    ? "right-[-8px] top-3 w-4 h-4 bg-purple-100"
                    : "left-[-8px] top-3 w-4 h-4 bg-white border-l border-t border-slate-200"
                } transform rotate-45`}
              ></div>
              <p className={`text-sm relative z-10`}>{message.content}</p>
            </div>

            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                U
              </div>
            )}
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {persona.name.charAt(0)}
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 max-w-[85%] relative">
              <div className="absolute left-[-8px] top-3 w-4 h-4 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
              <div className="text-sm text-slate-700 relative z-10 flex items-center">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full p-3 pr-10 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <Button
          onClick={handleSendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 shadow-sm"
          disabled={isLoading || !input.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Send
        </Button>
      </div>

      <Button
        onClick={onClose}
        className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
      >
        Close
      </Button>
    </div>
  );
}
