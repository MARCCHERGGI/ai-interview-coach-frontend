import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user interview history from the /trackProgress API endpoint
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/trackProgress", {
          method: "GET", // Adjust method if needed (GET/POST)
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch interview history.");
        }
        const data = await res.json();
        // Expecting data.interviews to be an array of interview records
        setInterviewHistory(data.interviews || []);
      } catch (err) {
        console.error(err);
        setError("Error fetching interview history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Compute the highest and lowest scores from the interview history
  const scores = interviewHistory.map((interview) => interview.score);
  const highestScore = scores.length ? Math.max(...scores) : null;
  const lowestScore = scores.length ? Math.min(...scores) : null;

  // Handler to redo a specific interview question
  const handleRedo = (interview) => {
    // Navigate to the interview page with a query parameter to indicate redo,
    // passing along the specific question for reattempt.
    router.push({
      pathname: "/interview",
      query: { redo: true, question: interview.question },
    });
  };

  // Handler to start a new interview
  const handleNewInterview = () => {
    router.push("/interview");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

        {loading ? (
          <p className="text-center text-gray-700">
            Loading interview history...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : interviewHistory.length === 0 ? (
          <p className="text-center text-gray-700">
            No interview history available. Start your first interview!
          </p>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Interview Stats</h2>
              <p className="text-gray-700">
                Highest Score:{" "}
                <span className="font-bold">
                  {highestScore !== null ? `${highestScore}/10` : "N/A"}
                </span>
              </p>
              <p className="text-gray-700">
                Lowest Score:{" "}
                <span className="font-bold">
                  {lowestScore !== null ? `${lowestScore}/10` : "N/A"}
                </span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Question</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Improvements</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewHistory.map((interview, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(interview.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{interview.question}</td>
                      <td className="px-4 py-2">{interview.score} / 10</td>
                      <td className="px-4 py-2">
                        {interview.improvements || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRedo(interview)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none"
                        >
                          Redo This Question
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={handleNewInterview}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
