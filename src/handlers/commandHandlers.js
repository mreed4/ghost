/* eslint-disable quote-props */
// Terminal command handlers

import { evaluateExpression } from "../utils/terminalUtils.js";
import { createUsernameHandlers } from "./usernameHandlers.js";
import { createSystemHandlers } from "./systemHandlers.js";

export const createCommandHandlers = (
  addToHistory,
  username,
  setUsername,
  setEditingUsername,
  setHistory
) => {
  // Create username handlers
  const { handleUsernameCommand, handleUsernameHelp } = createUsernameHandlers(
    addToHistory,
    username,
    setUsername,
    setEditingUsername
  );

  // Create system handlers
  const { handleSystemCommand, handleSystemHelp } = createSystemHandlers(
    addToHistory,
    username
  );
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
          "\n\nUsage examples:\n  calc 2+2\n  username random\n  system test\n  system uptime" +
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

  // Command Handlers Map
  const commandHandlers = {
    clear: handleClearCommand,
    help: handleHelpCommand,
    time: () => handleTimeCommand("time"),
    date: () => handleTimeCommand("date"),
    system: handleSystemHelp,
    username: handleUsernameHelp,
  };

  return {
    commandHandlers,
    handleUsernameCommand,
    handleSystemCommand,
    handleCalculation,
    handleUsernameHelp,
  };
};
