import { useState, useEffect } from "react";

export default function Settings() {
  // State for Timed Mode toggle
  const [timedMode, setTimedMode] = useState(false);
  const [error, setError] = useState("");

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedTimedMode = localStorage.getItem("timedMode");
      if (savedTimedMode !== null) {
        setTimedMode(savedTimedMode === "true");
      }
    } catch (err) {
      console.error("Error retrieving settings:", err);
      setError("Failed to load settings.");
    }
  }, []);

  // Toggle Timed Mode and persist the change
  const handleToggleTimedMode = () => {
    try {
      const newTimedMode = !timedMode;
      setTimedMode(newTimedMode);
      localStorage.setItem("timedMode", newTimedMode);
    } catch (err) {
      console.error("Error saving setting:", err);
      setError("Failed to update settings.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Interview Experience Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Interview Experience</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="timedMode"
              checked={timedMode}
              onChange={handleToggleTimedMode}
              className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="timedMode" className="text-gray-700">
              Enable Timed Mode (30s per question)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
