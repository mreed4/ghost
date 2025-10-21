// Input history hook for terminal command navigation
import { useState, useCallback, useRef } from "react";

export const useInputHistory = () => {
  const [inputHistory, setInputHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const savedCurrentInputRef = useRef("");

  // Add a command to history when submitted
  const addToInputHistory = useCallback((command) => {
    if (!command.trim()) return;

    setInputHistory((prev) => {
      // Don't add duplicate consecutive commands
      if (prev.length > 0 && prev[prev.length - 1] === command.trim()) {
        return prev;
      }

      // Limit history to last 50 commands to prevent memory issues
      const newHistory = [...prev, command.trim()];
      return newHistory.slice(-50);
    });

    // Reset history navigation
    setHistoryIndex(-1);
    savedCurrentInputRef.current = "";
  }, []);

  // Handle keydown events for arrow key navigation
  const handleHistoryKeyDown = useCallback(
    (e, inputValue, setInputValue) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();

        setInputHistory((history) => {
          if (history.length === 0) return history;

          let newIndex;
          if (historyIndex === -1) {
            // Starting navigation, save current input
            savedCurrentInputRef.current = inputValue;
            newIndex = history.length - 1;
          } else if (historyIndex > 0) {
            newIndex = historyIndex - 1;
          } else {
            newIndex = historyIndex; // Stay at first item
          }

          setHistoryIndex(newIndex);
          setInputValue(history[newIndex] || "");
          return history;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();

        setInputHistory((history) => {
          if (history.length === 0 || historyIndex === -1) return history;

          let newIndex;
          if (historyIndex < history.length - 1) {
            newIndex = historyIndex + 1;
            setInputValue(history[newIndex]);
          } else {
            // Back to saved current input
            newIndex = -1;
            setInputValue(savedCurrentInputRef.current);
          }

          setHistoryIndex(newIndex);
          return history;
        });
      } else if (e.key !== "Enter" && e.key !== "Escape") {
        // User is typing, reset navigation
        if (historyIndex !== -1) {
          setHistoryIndex(-1);
          savedCurrentInputRef.current = "";
        }
      }
    },
    [historyIndex]
  );

  return {
    inputHistory,
    addToInputHistory,
    handleHistoryKeyDown,
  };
};
