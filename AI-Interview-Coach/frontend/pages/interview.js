// /frontend/pages/interview.js

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import API_BASE_URL from "../config";

export default function Interview() {
  const router = useRouter();
  const { name, jobRole, timed } = router.query;
  const timedModeEnabled = timed === "true";

  // Chat state: messages, current input, current question, etc.
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch the first question once the router is ready
  useEffect(() => {
    if (!router.isReady) return;
    fetchFirstQuestion();
  }, [router.isReady]);

  // Fetch the first interview question from the backend API
  const fetchFirstQuestion = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/generateQuestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, jobRole }),
      });
      if (!res.ok) throw new Error("Failed to fetch question");
      const data = await res.json();
      const question = data.question;
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          type: "question",
          text: question,
          timestamp: new Date(),
        },
      ]);
      setCurrentQuestion(question);
      if (timedModeEnabled) resetTimer();
    } catch (error) {
      console.error("Error fetching question:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          type: "error",
          text: "Error fetching the question. Please refresh the page.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Reset the timer for timed mode
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);
    if (timedModeEnabled) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (!isSubmitting) handleAnswerSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const trimmedAnswer = currentInput.trim();
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        type: "answer",
        text: trimmedAnswer || "[No Answer]",
        timestamp: new Date(),
      },
    ]);

    try {
      const res = await fetch(`${API_BASE_URL}/analyzeAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          jobRole,
          question: currentQuestion,
          answer: trimmedAnswer,
        }),
      });
      if (!res.ok) throw new Error("Failed to analyze answer");
      const data = await res.json();

      if (data.feedback) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            type: "feedback",
            text: data.feedback,
            timestamp: new Date(),
          },
        ]);
      }
      if (data.nextQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            type: "question",
            text: data.nextQuestion,
            timestamp: new Date(),
          },
        ]);
        setCurrentQuestion(data.nextQuestion);
        if (timedModeEnabled) resetTimer();
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          type: "error",
          text: "Error processing your answer. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
    setCurrentInput("");
    setIsSubmitting(false);
    if (timedModeEnabled && timerRef.current) clearInterval(timerRef.current);
  };

  // Auto-scroll chat container to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header Section */}
      <div className="mb-4 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">Interview with {name}</h1>
        <p className="text-gray-600">Job Role: {jobRole}</p>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="chat-container w-full max-w-md bg-white shadow-lg rounded-lg p-4 overflow-y-auto"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender} mb-3`}>
            <div className="chat-content">
              <span className="chat-text">{msg.text}</span>
              <span className="chat-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Timer Display */}
      {timedModeEnabled && (
        <div className="mb-2 text-center font-bold text-red-600">
          Time left: {timeLeft}s
        </div>
      )}

      {/* Answer Input Form */}
      <form
        onSubmit={handleAnswerSubmit}
        className="chat-input w-full max-w-md flex mt-4"
      >
        <input
          type="text"
          name="answer"
          id="answer"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Type your answer..."
          className="input-box flex-1 border rounded-l-2xl px-4 py-2 focus:outline-none"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="send-button bg-indigo-500 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-r-2xl focus:outline-none"
          disabled={isSubmitting}
        >
          Send
        </button>
      </form>
    </div>
  );
}
