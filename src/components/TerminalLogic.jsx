/* eslint-disable quote-props */
// TerminalLogic.js
import { useState, useRef, useEffect } from "react";

function useTerminalLogic() {
  // State and Refs
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(
    `user${Math.floor(Math.random() * 10000)}`
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Core Command Handling
  function handleCommandSubmit(e) {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const command = inputValue.trim().toLowerCase();

    // Handle known commands first
    if (commandHandlers[command]) {
      commandHandlers[command]();
      setInputValue("");
      return;
    }

    // Handle calculation commands
    if (command.startsWith("calc ")) {
      handleCalculation(command.slice(5).trim());
      setInputValue(""); // Clear input only after processing
      return;
    }

    // Handle general command evaluation
    handleGeneralCommand(command);
    setInputValue("");
  }

  // Command Handlers
  const commandHandlers = {
    "clear": () => {
      setHistory([]);
    },
    "username edit": () => {
      handleUsernameCommand("edit");
    },
    "username change": () => {
      handleUsernameCommand("change");
    },
    "username new": () => {
      handleUsernameCommand("new");
    },
    "username random": () => {
      handleUsernameCommand("random");
    },
    "time": () => handleTimeCommand(),
  };

  function handleUsernameCommand(command) {
    const commands = ["edit", "new", "change"];

    if (commands.includes(command)) {
      setEditingUsername(true);
      setHistory((prev) => [
        ...prev,
        {
          prompt: `${username}@ghost:~$`,
          command: `username ${command}`,
          submittedUsername: username,
        },
      ]);
      return;
    }

    if (command === "random") {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();
      setHistory((prev) => [
        ...prev,
        {
          prompt: `${oldUsername}@ghost:~$`,
          command: "username random",
          submittedUsername: oldUsername,
        },
        {
          prompt: "",
          command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`,
          isUsernameChange: true,
        },
      ]);
      setUsername(newRandomUsername);
    }
  }

  function handleCalculation(expression) {
    const result = evaluateExpression(expression);
    setHistory((prev) => [
      ...prev,
      {
        prompt: `${username}@ghost:~$`,
        command: `calc ${expression}`,
        submittedUsername: username,
      },
      { prompt: "", command: `Result: ${result}`, isSystemMessage: true }, // Mark as a system message
    ]);
  }

  const handleTimeCommand = () => {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    setHistory((prev) => [
      ...prev,
      {
        prompt: `${username}@ghost:~$`,
        command: "time",
        submittedUsername: username,
      },
      {
        prompt: "",
        command: `Current date and time: ${formattedTime}`,
        isSystemMessage: true, // Mark as a system message
      },
    ]);
  };

  function handleGeneralCommand(command) {
    const result = evaluateExpression(command);
    setHistory((prev) => {
      const updatedHistory = [
        ...prev,
        {
          prompt: `${username}@ghost:~$`,
          command: inputValue,
          submittedUsername: username,
        },
      ];
      if (!isNaN(result)) {
        updatedHistory.push({
          prompt: "",
          command: `Result: ${result}`,
          isSystemMessage: true,
        });
      }
      return updatedHistory;
    });
  }

  // Username Change Handling
  function handleUsernameChange(e) {
    e.preventDefault();

    const trimmedNewUsername = newUsername.trim();
    if (!trimmedNewUsername) return;

    const oldUsername = username;
    setHistory((prev) => [
      ...prev,
      {
        prompt: `${oldUsername}@ghost:~$`,
        command: `Username changed from ${oldUsername} to ${trimmedNewUsername}`,
        isUsernameChange: true,
      },
    ]);
    setUsername(trimmedNewUsername);
    resetUsernameEditing();
  }

  function resetUsernameEditing() {
    setEditingUsername(false);
    setNewUsername("");
    inputRef.current.focus();
  }

  // Utility Functions
  function generateRandomUsername() {
    return `user${Math.floor(Math.random() * 10000)}`;
  }

  function evaluateExpression(expression) {
    try {
      const sanitizedExpression = expression.replace(/[^0-9+\-*/(). ]/g, "");
      const result = eval(sanitizedExpression);
      return result !== undefined ? result : "Error";
    } catch {
      return "Error";
    }
  }

  // Effects
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, editingUsername]);

  // Return Values
  return {
    history,
    inputValue,
    setInputValue,
    username,
    editingUsername,
    newUsername,
    setNewUsername,
    inputRef,
    terminalEndRef,
    handleCommandSubmit,
    handleUsernameChange,
  };
}

export default useTerminalLogic;
