/* eslint-disable quote-props */
// TerminalLogic.js
import { useState, useRef, useEffect } from "react";

function useTerminalLogic() {
  // State and Refs
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(`user${Math.floor(Math.random() * 10000)}`);
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
      setInputValue("");
      return;
    }

    // Handle general command evaluation
    handleGeneralCommand(command);
    setInputValue("");
  }

  // Command Handlers
  const commandHandlers = {
    "clear": function() {
      setHistory([]);
    },
    "username edit": function() {
      handleUsernameCommand("edit");
    },
    "username change": function() {
      handleUsernameCommand("change");
    },
    "username new": function() {
      handleUsernameCommand("new");
    },
    "username random": function() {
      handleUsernameCommand("random");
    },
  };

  function handleUsernameCommand(command) {
    const commands = ["edit", "new", "change"];

    if (commands.includes(command)) {
      setEditingUsername(true);
      setHistory((prev) => [
        ...prev,
        { prompt: `${username}@ghost:~$`, command: `username ${command}`, submittedUsername: username },
      ]);
    }

    if (command === "random") {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();
      setUsername(newRandomUsername);
      setHistory((prev) => [
        ...prev,
        { prompt: `${username}@ghost:~$`, command: "username random", submittedUsername: username },
        { prompt: "", command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`, isUsernameChange: true },
      ]);
    }
  }

  function handleCalculation(expression) {
    const result = evaluateExpression(expression);
    setHistory((prev) => [
      ...prev,
      { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username },
      { prompt: "", command: `Result: ${result}`, isUsernameChange: true },
    ]);
  }

  function handleGeneralCommand(command) {
    const result = evaluateExpression(command);
    if (!isNaN(result)) {
      setHistory((prev) => [
        ...prev,
        { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username },
        { prompt: "", command: `Result: ${result}`, isUsernameChange: true },
      ]);
    } else {
      setHistory((prev) => [...prev, { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username }]);
    }
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

  // Username Change Handling
  function handleUsernameChange(e) {
    e.preventDefault();
    if (newUsername.trim() !== "") {
      const oldUsername = username;
      setUsername(newUsername.trim());
      setEditingUsername(false);
      setNewUsername("");
      inputRef.current.focus();
      setHistory((prev) => [
        ...prev,
        { prompt: "", command: `Username changed from ${oldUsername} to ${newUsername.trim()}`, isUsernameChange: true },
      ]);
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
