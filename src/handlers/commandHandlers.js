/* eslint-disable quote-props */
// Terminal command handlers

import {
  generateRandomUsername,
  evaluateExpression,
  generateRandomUptime,
  generateTestStatus,
} from "../utils/terminalUtils.js";

export const createCommandHandlers = (
  addToHistory,
  username,
  setUsername,
  setEditingUsername,
  setHistory
) => {
  const handleClearCommand = () => {
    setHistory([]);
  };

  const handleHelpCommand = () => {
    try {
      // Include calc command in help (username is already in commandHandlers)
      const allCommands = [...Object.keys(commandHandlers), "calc"].sort();
      const columns = 3;
      const maxCommandLength = Math.max(
        ...allCommands.map((cmd) => cmd.length)
      );
      const paddedCommands = allCommands.map((cmd) =>
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
        command:
          "Available commands:\n" +
          grid.trimEnd() +
          "\n\nUsage examples:\n  calc 2+2\n  username random\n  username edit" +
          "\n\nAliases:\n  date|time - Show current date and time\n  username edit|change|new|update - Enter username editing mode",
        isSystemMessage: true,
      });
    } catch (error) {
      console.error("Error in help command:", error);
      addToHistory({
        prompt: "",
        command: "Error displaying help information",
        isSystemMessage: true,
      });
    }
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

  const handleUsernameHelp = () => {
    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: "username",
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: `Username commands:
  username edit|change|new|update  - Enter username editing mode
  username random                  - Generate a random username

Current username: ${username}

Note: edit, change, new, and update are aliases - they all do the same thing.`,
      isSystemMessage: true,
    });
  };

  const handleCalculation = (expression) => {
    if (!expression || typeof expression !== "string") {
      addToHistory({
        prompt: `${username}@ghost:~$`,
        command: `calc ${expression || ""}`,
        submittedUsername: username,
      });
      addToHistory({
        prompt: "",
        command: "Error: No expression provided. Usage: calc <expression>",
        isSystemMessage: true,
      });
      return;
    }

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
      command: `Current date and time: ${formattedTime}

Note: 'date' and 'time' commands are aliases - they both show the same information.`,
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
    clear: handleClearCommand,
    help: handleHelpCommand,
    time: () => handleTimeCommand("time"),
    date: () => handleTimeCommand("date"),
    uptime: handleUptimeCommand,
    test: handleTestCommand,
    username: handleUsernameHelp,
  };

  return {
    commandHandlers,
    handleUsernameCommand,
    handleCalculation,
    handleUsernameHelp,
  };
};
