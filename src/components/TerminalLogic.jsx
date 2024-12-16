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
    // "calc" -- see function handleCalculation
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
    "username update": () => {
      handleUsernameCommand("update");
    },
    "username random": () => {
      handleUsernameCommand("random");
    },
    "time": () => handleTimeCommand("time"),
    "date": () => handleTimeCommand("date"),
    "uptime": () => handleUptimeCommand(),
    "test": () => handleTestCommand(),
    "help": () => {
      // Get the available commands and sort them alphabetically
      const availableCommands = Object.keys(commandHandlers).sort();

      // Define the number of columns for the grid
      const columns = 3;

      // Calculate the max width of commands for uniform spacing
      const maxCommandLength = Math.max(
        ...availableCommands.map((cmd) => cmd.length)
      );
      const paddedCommands = availableCommands.map((cmd) =>
        cmd.padEnd(maxCommandLength, " ")
      );

      // Build the grid using rows and columns
      let grid = "";
      for (let i = 0; i < paddedCommands.length; i += columns) {
        const row = paddedCommands.slice(i, i + columns).join("  "); // Add spacing between columns
        grid += row + "\n";
      }

      // Add the grid to the terminal history
      setHistory((prev) => [
        ...prev,
        {
          prompt: `${username}@ghost:~$`,
          command: "help",
          submittedUsername: username,
        },
        {
          prompt: "",
          command: grid.trimEnd(), // Trim any trailing newline
          isSystemMessage: true,
        },
      ]);
    },
  };

  function handleUsernameCommand(command) {
    const commands = ["edit", "new", "change", "update"];

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

  const handleTimeCommand = (command) => {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    setHistory((prev) => [
      ...prev,
      {
        prompt: `${username}@ghost:~$`,
        command: `${command}`,
        submittedUsername: username,
      },
      {
        prompt: "",
        command: `Current date and time: ${formattedTime}`,
        isSystemMessage: true, // Mark as a system message
      },
    ]);
  };

  // eslint-disable-next-line no-unused-vars
  function handleGeneralCommand(command) {
    setHistory((prev) => {
      const updatedHistory = [
        ...prev,
        {
          prompt: `${username}@ghost:~$`,
          command: inputValue,
          submittedUsername: username,
        },
      ];
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

  const handleTestCommand = () => {
    const cpuStatus = generateRandomCpuStatus();
    const ramStatus = generateRandomRamStatus();
    const storageStatus = generateRandomStorageStatus();
    const networkStatus = generateRandomNetworkStatus();
    const gpuStatus = generateRandomGpuStatus();
    const overallStatus = `${cpuStatus}...${ramStatus}...${storageStatus}...${networkStatus}...${gpuStatus}`;
    setHistory((prev) => [
      ...prev,
      {
        prompt: `${username}@ghost:~$`,
        command: "test",
        submittedUsername: username,
      },
      {
        prompt: "",
        command: `Self-test results (simulated): ${overallStatus}`,
        isSystemMessage: true,
      },
    ]);
  };

  const generateRandomCpuStatus = () => {
    const statuses = ["Passed", "Failed"];
    return `CPU: ${statuses[Math.floor(Math.random() * statuses.length)]}`;
  };

  const generateRandomRamStatus = () => {
    const statuses = ["Passed", "Failed"];
    return `RAM: ${statuses[Math.floor(Math.random() * statuses.length)]}`;
  };

  const generateRandomStorageStatus = () => {
    const statuses = ["Passed", "Failed"];
    return `Storage: ${statuses[Math.floor(Math.random() * statuses.length)]}`;
  };

  const generateRandomNetworkStatus = () => {
    const statuses = ["Connected", "Disconnected"];
    return `Network: ${statuses[Math.floor(Math.random() * statuses.length)]}`;
  };

  const generateRandomGpuStatus = () => {
    const statuses = ["Enabled", "Disabled"];
    return `GPU: ${statuses[Math.floor(Math.random() * statuses.length)]}`;
  };

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

  const handleUptimeCommand = () => {
    const randomUptime = generateRandomUptime(); // Generate a random uptime
    setHistory((prev) => [
      ...prev,
      {
        prompt: `${username}@ghost:~$`,
        command: "uptime",
        submittedUsername: username,
      },
      {
        prompt: "",
        command: `System uptime (simulated): ${randomUptime}`,
        isSystemMessage: true,
      },
    ]);
  };

  const generateRandomUptime = () => {
    const days = Math.floor(Math.random() * 30); // Random days (0-29)
    const hours = Math.floor(Math.random() * 24); // Random hours (0-23)
    const minutes = Math.floor(Math.random() * 60); // Random minutes (0-59)
    const seconds = Math.floor(Math.random() * 60); // Random seconds (0-59)

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

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
