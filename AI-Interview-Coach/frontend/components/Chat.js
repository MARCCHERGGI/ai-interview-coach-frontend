import React, { useEffect, useRef } from "react";

const Chat = ({ messages = [], isTyping = false }) => {
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages update or AI is typing
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow h-full overflow-y-auto">
      {/* Render chat messages */}
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.sender === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                msg.sender === "ai"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No messages yet.</p>
      )}

      {/* Show typing indicator for AI */}
      {isTyping && (
        <div className="mb-4 flex justify-start">
          <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-blue-100 text-blue-900 flex items-center">
            <span className="mr-2">AI is typing</span>
            <span className="animate-pulse">...</span>
          </div>
        </div>
      )}

      {/* Dummy element for auto-scrolling */}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default Chat;
