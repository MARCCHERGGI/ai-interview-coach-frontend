import { useState, useEffect, useRef } from "react";

/**
 * Timer Component
 *
 * Props:
 * - initialTime (number): Countdown start time in seconds (default: 30)
 * - isActive (boolean): Flag to indicate if timed mode is active
 * - onTimeUp (function): Callback function to trigger when time runs out
 */
const Timer = ({ initialTime = 30, isActive, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);

  // Clear any existing timer
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // If timer mode is not active, reset timer and clear any intervals
    if (!isActive) {
      clearTimer();
      setTimeLeft(initialTime);
      return;
    }

    // Start countdown timer
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearTimer();
          if (onTimeUp) onTimeUp(); // Automatically submit answer on timeout
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup on component unmount or when isActive changes
    return () => clearTimer();
  }, [isActive, initialTime, onTimeUp]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-xl font-bold text-red-600">
        {timeLeft} second{timeLeft !== 1 && "s"} remaining
      </div>
    </div>
  );
};

export default Timer;
