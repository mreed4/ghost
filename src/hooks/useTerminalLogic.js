/* eslint-disable quote-props */
// Main terminal logic hook
import { useState, useRef, useEffect } from "react";
import { addToHistory } from "../utils/terminalUtils.js";
import {
  getTypoCorrection,
  createTypoHandlers,
} from "../utils/typoCorrection.js";
import { createCommandHandlers } from "../handlers/commandHandlers.js";
import { useInputHistory } from "./useInputHistory.js";

function useTerminalLogic() {
  // State
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(
    `user${Math.floor(Math.random() * 10000)}`
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [awaitingTypoConfirmation, setAwaitingTypoConfirmation] =
    useState(false);
  const [pendingTypoCorrection, setPendingTypoCorrection] = useState(null);
  const [typoResponse, setTypoResponse] = useState("");

  // Refs
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Input history hook
  const { addToInputHistory, handleHistoryKeyDown } = useInputHistory();

  // Create bound addToHistory function
  const boundAddToHistory = (entry) => addToHistory(setHistory, entry);

  // Create command handlers (only need commandHandlers for typo handlers)
  const { commandHandlers } = createCommandHandlers(
    boundAddToHistory,
    username,
    setUsername,
    setEditingUsername,
    setHistory
  );

  // Create typo handlers
  const { handleTypoCorrection, handleTypoConfirmation } = createTypoHandlers(
    boundAddToHistory,
    username,
    setAwaitingTypoConfirmation,
    setPendingTypoCorrection,
    setTypoResponse,
    inputRef,
    commandHandlers
  );

  // Bound typo confirmation handler
  const boundHandleTypoConfirmation = (e, isCancelled = false) => {
    return handleTypoConfirmation(
      e,
      isCancelled,
      typoResponse,
      pendingTypoCorrection
    );
  };

  // Core Command Handling
  function handleCommandSubmit(e) {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const input = inputValue.trim();
    const lowerInput = input.toLowerCase();
    const [baseCommand, ...args] = lowerInput.split(" ");
    const argsString = args.join(" ");

    // Create context-aware addToHistory function for this command
    const contextualAddToHistory = (entry) => {
      if (entry.isSystemMessage && entry.submittedUsername) {
        // Add user input context to system messages
        entry.userInput = input;
      }
      addToHistory(setHistory, entry);
    };

    // Create command handlers with contextual history
    const {
      commandHandlers,
      handleUsernameCommand,
      handleSystemCommand,
      handleCalculation,
    } = createCommandHandlers(
      contextualAddToHistory,
      username,
      setUsername,
      setEditingUsername,
      setHistory
    );

    // Handle calc command with arguments
    if (baseCommand === "calc" && argsString) {
      handleCalculation(argsString);
    }
    // Handle username commands with subcommands
    else if (baseCommand === "username" && args.length > 0) {
      const subCommand = args[0];
      if (["edit", "change", "new", "update", "random"].includes(subCommand)) {
        handleUsernameCommand(subCommand);
      } else {
        contextualAddToHistory({
          command: `Invalid username subcommand: ${subCommand}. Type 'username' for available options.`,
          submittedUsername: username,
          isSystemMessage: true,
        });
      }
    }
    // Handle system commands with subcommands
    else if (baseCommand === "system" && args.length > 0) {
      const subCommand = args[0];
      if (["test", "uptime"].includes(subCommand)) {
        handleSystemCommand(subCommand);
      } else {
        contextualAddToHistory({
          command: `Invalid system subcommand: ${subCommand}. Type 'system' for available options.`,
          submittedUsername: username,
          isSystemMessage: true,
        });
      }
    }
    // Handle exact command matches
    else if (commandHandlers[lowerInput]) {
      commandHandlers[lowerInput]();
    }
    // Handle single word commands
    else if (commandHandlers[baseCommand]) {
      commandHandlers[baseCommand]();
    }
    // Check for typos before treating as unknown command
    else {
      const typoCorrection = getTypoCorrection(baseCommand);
      if (typoCorrection) {
        handleTypoCorrection(input, typoCorrection);
      } else {
        contextualAddToHistory({
          command: `Command not found: ${
            input.split(" ")[0]
          }. Type 'help' for available commands.`,
          submittedUsername: username,
          isSystemMessage: true,
        });
      }
    }

    // Add command to input history
    addToInputHistory(input);
    setInputValue("");
  }

  // Username Change Handling
  function handleUsernameChange(e, isCancelled = false) {
    e.preventDefault();

    // Handle cancellation
    if (isCancelled) {
      boundAddToHistory({
        command: "Username edit cancelled",
        isSystemMessage: true,
      });
      setEditingUsername(false);
      setNewUsername("");
      inputRef.current?.focus();
      return;
    }

    const trimmedNewUsername = newUsername.trim();

    // Validate username
    if (!trimmedNewUsername) {
      boundAddToHistory({
        command: "Error: Username cannot be empty",
        isSystemMessage: true,
      });
      return;
    }

    if (trimmedNewUsername.length > 20) {
      boundAddToHistory({
        command: "Error: Username cannot be longer than 20 characters",
        isSystemMessage: true,
      });
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedNewUsername)) {
      boundAddToHistory({
        command:
          "Error: Username can only contain letters, numbers, hyphens, and underscores",
        isSystemMessage: true,
      });
      return;
    }

    const oldUsername = username;
    if (trimmedNewUsername === oldUsername) {
      boundAddToHistory({
        command: "Error: New username is the same as current username",
        isSystemMessage: true,
      });
      setEditingUsername(false);
      setNewUsername("");
      inputRef.current?.focus();
      return;
    }

    boundAddToHistory({
      command: `Username changed from ${oldUsername} to ${trimmedNewUsername}`,
      submittedUsername: oldUsername,
      isUsernameChange: true,
      isSystemMessage: true,
    });
    setUsername(trimmedNewUsername);
    setEditingUsername(false);
    setNewUsername("");
    inputRef.current?.focus();
  }

  // Effects
  useEffect(() => {
    // Ensure smooth scrolling to bottom when history updates
    const scrollToBottom = () => {
      if (terminalEndRef.current) {
        terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Use a small delay to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 10);
    return () => clearTimeout(timeoutId);
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
    awaitingTypoConfirmation,
    typoResponse,
    setTypoResponse,
    inputRef,
    terminalEndRef,
    handleCommandSubmit,
    handleUsernameChange,
    handleTypoConfirmation: boundHandleTypoConfirmation,
    handleHistoryKeyDown,
  };
}

export default useTerminalLogic;
