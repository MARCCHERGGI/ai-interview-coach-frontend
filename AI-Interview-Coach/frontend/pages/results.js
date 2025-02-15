import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Results() {
  const router = useRouter();
  const { score } = router.query;
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    if (score) {
      // Ensure the score is a number
      setFinalScore(Number(score));
    }
  }, [score]);

  const handleRetry = () => {
    router.push("/interview");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Interview Results</h1>

        {finalScore !== null ? (
          <div>
            <p className="text-xl mb-2">
              Your Score: <span className="font-bold">{finalScore}/10</span>
            </p>
            {finalScore < 5 ? (
              <p className="text-red-500 mb-4">
                It looks like you might need some extra practice. Don't
                worry—every expert started as a beginner. Keep practicing and
                you'll get there!
              </p>
            ) : (
              <p className="text-green-500 mb-4">
                Great job! You performed well. Keep up the good work and
                continue honing your skills.
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-700 mb-4">
            No score available. Please complete your interview first.
          </p>
        )}

        <div className="flex justify-around mt-6">
          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Retry Interview
          </button>
          <button
            onClick={handleDashboard}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
