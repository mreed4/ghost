/* eslint-disable quote-props */
// TerminalLogic.js
import { useState, useRef, useEffect } from "react";

function useTerminalLogic() {
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(
    `user${Math.floor(Math.random() * 10000)}`
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Utility Functions
  const addToHistory = (entry) => {
    setHistory((prev) => [...prev, entry]);
  };

  const generateRandomUsername = () => {
    return `user${Math.floor(Math.random() * 10000)}`;
  };

  const evaluateExpression = (expression) => {
    try {
      const sanitizedExpression = expression.replace(/[^0-9+\-*/(). ]/g, "");
      const result = eval(sanitizedExpression);
      return result !== undefined ? result : "Error";
    } catch {
      return "Error";
    }
  };

  const generateRandomUptime = () => {
    const days = Math.floor(Math.random() * 30);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const generateTestStatus = (statuses) => {
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Command Handlers
  const handleClearCommand = () => {
    setHistory([]);
  };

  const handleHelpCommand = () => {
    const availableCommands = Object.keys(commandHandlers).sort();
    const columns = 3;
    const maxCommandLength = Math.max(
      ...availableCommands.map((cmd) => cmd.length)
    );
    const paddedCommands = availableCommands.map((cmd) =>
      cmd.padEnd(maxCommandLength, " ")
    );
    let grid = "";
    for (let i = 0; i < paddedCommands.length; i += columns) {
      const row = paddedCommands.slice(i, i + columns).join("  ");
      grid += row + "\n";
    }
    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: "help",
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: "Available commands:\n" + grid.trimEnd(),
      isSystemMessage: true,
    });
  };

  const handleUsernameCommand = (command) => {
    const commands = ["edit", "new", "change", "update"];
    if (commands.includes(command)) {
      setEditingUsername(true);
      addToHistory({
        prompt: `${username}@ghost:~$`,
        command: `username ${command}`,
        submittedUsername: username,
      });
      return;
    }
    if (command === "random") {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();
      addToHistory({
        prompt: `${oldUsername}@ghost:~$`,
        command: "username random",
        submittedUsername: oldUsername,
      });
      addToHistory({
        prompt: "",
        command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`,
        isUsernameChange: true,
        isSystemMessage: true,
      });
      setUsername(newRandomUsername);
    }
  };

  const handleCalculation = (expression) => {
    const result = evaluateExpression(expression);
    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: `calc ${expression}`,
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: `Result: ${result}`,
      isSystemMessage: true,
    });
  };

  const handleTimeCommand = (keyword) => {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: `${keyword}`,
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: `Current date and time: ${formattedTime}`,
      isSystemMessage: true,
    });
  };

  const handleUptimeCommand = () => {
    const randomUptime = generateRandomUptime();
    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: "uptime",
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: `System uptime (simulated): ${randomUptime}`,
      isSystemMessage: true,
    });
  };

  const handleTestCommand = () => {
    const cpuStatus = `CPU: ${generateTestStatus(["Passed", "Failed"])}`;
    const ramStatus = `RAM: ${generateTestStatus(["Passed", "Failed"])}`;
    const storageStatus = `Storage: ${generateTestStatus([
      "Passed",
      "Failed",
    ])}`;
    const networkStatus = `Network: ${generateTestStatus([
      "Connected",
      "Disconnected",
    ])}`;
    const gpuStatus = `GPU: ${generateTestStatus(["Enabled", "Disabled"])}`;
    const overallStatus = `${cpuStatus}\n${ramStatus}\n${storageStatus}\n${networkStatus}\n${gpuStatus}`;

    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: "test",
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: `Self-test results (simulated):\n${overallStatus}`,
      isSystemMessage: true,
    });
  };

  // Command Handlers Map
  const commandHandlers = {
    "clear": handleClearCommand,
    "help": handleHelpCommand,
    "username edit": () => handleUsernameCommand("edit"),
    "username change": () => handleUsernameCommand("change"),
    "username new": () => handleUsernameCommand("new"),
    "username update": () => handleUsernameCommand("update"),
    "username random": () => handleUsernameCommand("random"),
    "calc": (args) => handleCalculation(args),
    "time": () => handleTimeCommand("time"),
    "date": () => handleTimeCommand("date"),
    "uptime": handleUptimeCommand,
    "test": handleTestCommand,
  };

  // Core Command Handling
  function handleCommandSubmit(e) {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    const command = inputValue.trim().toLowerCase();
    if (commandHandlers[command]) {
      commandHandlers[command]();
    } else {
      addToHistory({
        prompt: `${username}@ghost:~$`,
        command: inputValue,
        submittedUsername: username,
      });
    }
    setInputValue("");
  }

  // Username Change Handling
  function handleUsernameChange(e) {
    e.preventDefault();
    const trimmedNewUsername = newUsername.trim();
    if (!trimmedNewUsername) return;
    const oldUsername = username;
    addToHistory({
      prompt: `${oldUsername}@ghost:~$`,
      command: `Username changed from ${oldUsername} to ${trimmedNewUsername}`,
      isUsernameChange: true,
      isSystemMessage: true,
    });
    setUsername(trimmedNewUsername);
    setEditingUsername(false);
    setNewUsername("");
    inputRef.current.focus();
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
