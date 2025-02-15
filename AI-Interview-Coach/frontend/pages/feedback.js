import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Feedback() {
  const router = useRouter();
  const { name, jobRole, question, answer } = router.query;

  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch feedback from the backend API once router is ready and all parameters are available
  useEffect(() => {
    if (!router.isReady) return;

    // Validate required query parameters
    if (!name || !jobRole || !question || !answer) {
      setError("Missing interview data. Please complete your interview first.");
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        const res = await fetch("/analyzeAnswer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, jobRole, question, answer }),
        });
        if (!res.ok) {
          throw new Error("Failed to fetch feedback.");
        }
        const data = await res.json();
        setFeedbackData(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [router.isReady, name, jobRole, question, answer]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Interview Feedback
        </h1>

        {loading ? (
          <p className="text-center text-gray-700">Loading feedback...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : feedbackData ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Your Performance</h2>
              <p className="text-gray-700 mt-2">
                <span className="font-bold">Score:</span>{" "}
                {feedbackData.score ? feedbackData.score : "N/A"} / 10
              </p>
              <p className="text-gray-700 mt-2">
                {feedbackData.feedback
                  ? feedbackData.feedback
                  : "No feedback provided."}
              </p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Ideal Answer Example</h2>
              <p className="text-gray-700 mt-2">
                {feedbackData.idealAnswer
                  ? feedbackData.idealAnswer
                  : "No ideal answer available."}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">
            No feedback data available.
          </p>
        )}
      </div>
    </div>
  );
}
