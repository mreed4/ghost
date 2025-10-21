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

  function handleClearCommand() {
    setHistory([]);
  }

  function handleHelpCommand() {
    try {
      // Get all commands from the commandHandlers map
      const allCommands = Object.keys(commandHandlers).sort();
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
        command: "help",
        submittedUsername: username,
      });
      addToHistory({
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
        command: "Error displaying help information",
        isSystemMessage: true,
      });
    }
  }

  function handleCalculation(expression) {
    if (!expression || typeof expression !== "string") {
      addToHistory({
        command: `calc ${expression || ""}`,
        submittedUsername: username,
      });
      addToHistory({
        command: "Error: No expression provided. Usage: calc <expression>",
        isSystemMessage: true,
      });
      return;
    }

    const result = evaluateExpression(expression);
    addToHistory({
      command: `calc ${expression}`,
      submittedUsername: username,
    });
    addToHistory({
      command: `Result: ${result}`,
      isSystemMessage: true,
    });
  }

  function createTimeHandler(commandName) {
    return function () {
      const now = new Date();
      const formattedTime = now.toLocaleString();

      addToHistory({
        command: commandName,
        submittedUsername: username,
      });
      addToHistory({
        command: `Current date and time: ${formattedTime}

Note: 'date' and 'time' commands are aliases - they both show the same information.`,
        isSystemMessage: true,
      });
    };
  }

  // Command Handlers Map
  const commandHandlers = {
    clear: handleClearCommand,
    help: handleHelpCommand,
    time: createTimeHandler("time"),
    date: createTimeHandler("date"),
    calc: handleCalculation,
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
