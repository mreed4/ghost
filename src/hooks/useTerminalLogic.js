/* eslint-disable quote-props */
// Main terminal logic hook
import { useRef, useEffect } from "react";
import { addToHistory } from "../utils/terminalUtils.js";
import {
  getTypoCorrection,
  createTypoHandlers,
} from "../utils/typoCorrection.js";
import { createCommandHandlers } from "../handlers/commandHandlers.js";
import { useInputHistory } from "./useInputHistory.js";
import { useTerminalState } from "./useTerminalState.js";

function useTerminalLogic() {
  // State management
  const {
    history,
    setHistory,
    inputValue,
    setInputValue,
    username,
    setUsername,
    editingUsername,
    newUsername,
    setEditingUsername,
    setNewUsername,
    awaitingTypoConfirmation,
    pendingTypoCorrection,
    typoResponse,
    setAwaitingTypoConfirmation,
    setPendingTypoCorrection,
    setTypoResponse,
  } = useTerminalState();

  // Refs
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Input history hook
  const { addToInputHistory, handleHistoryKeyDown } = useInputHistory();

  // Create bound addToHistory function
  const boundAddToHistory = (entry) => addToHistory(setHistory, entry);

  // Create command handlers (only need commandHandlers for typo handlers)
  const { commandHandlers } = createCommandHandlers({
    addToHistory: boundAddToHistory,
    username,
    setUsername,
    setEditingUsername,
    setHistory,
  });

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
    } = createCommandHandlers({
      addToHistory: contextualAddToHistory,
      username,
      setUsername,
      setEditingUsername,
      setHistory,
    });

    // Command condition variables
    const isCalcCommand = baseCommand === "calc" && argsString;
    const isUsernameCommand = baseCommand === "username" && args.length > 0;
    const isSystemCommand = baseCommand === "system" && args.length > 0;
    const hasExactMatch = commandHandlers[lowerInput];
    const hasSingleWordMatch = commandHandlers[baseCommand];
    const typoCorrection = getTypoCorrection(baseCommand);
    const hasTypoCorrection = !!typoCorrection;

    // Handle calc command with arguments
    if (isCalcCommand) {
      handleCalculation(argsString);
      addToInputHistory(input);
      setInputValue("");
      return;
    }

    // Handle username commands with subcommands
    if (isUsernameCommand) {
      const subCommand = args[0];
      const newUsernameArg = args.slice(1).join(" "); // Join remaining args as username
      const validUsernameCommands = [
        "edit",
        "change",
        "new",
        "update",
        "random",
      ];
      const isValidUsernameSubCommand =
        validUsernameCommands.includes(subCommand);

      if (isValidUsernameSubCommand) {
        handleUsernameCommand(subCommand, newUsernameArg);
      } else {
        contextualAddToHistory({
          command: `Invalid username subcommand: ${subCommand}. Type 'username' for available options.`,
          submittedUsername: username,
          isSystemMessage: true,
        });
      }
      addToInputHistory(input);
      setInputValue("");
      return;
    }

    // Handle system commands with subcommands
    if (isSystemCommand) {
      const subCommand = args[0];
      const validSystemCommands = ["test", "uptime"];
      const isValidSystemSubCommand = validSystemCommands.includes(subCommand);

      if (isValidSystemSubCommand) {
        handleSystemCommand(subCommand);
      } else {
        contextualAddToHistory({
          command: `Invalid system subcommand: ${subCommand}. Type 'system' for available options.`,
          submittedUsername: username,
          isSystemMessage: true,
        });
      }
      addToInputHistory(input);
      setInputValue("");
      return;
    }

    // Handle exact command matches
    if (hasExactMatch) {
      commandHandlers[lowerInput]();
      addToInputHistory(input);
      setInputValue("");
      return;
    }

    // Handle single word commands
    if (hasSingleWordMatch) {
      commandHandlers[baseCommand]();
      addToInputHistory(input);
      setInputValue("");
      return;
    }

    // Check for typos before treating as unknown command
    if (hasTypoCorrection) {
      handleTypoCorrection(input, typoCorrection);
      addToInputHistory(input);
      setInputValue("");
      return;
    } // Command not found
    contextualAddToHistory({
      command: `Command not found: ${
        input.split(" ")[0]
      }. Type 'help' for available commands.`,
      submittedUsername: username,
      isSystemMessage: true,
    });

    // Add command to input history and clear input
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
    const oldUsername = username;

    // Validation condition variables
    const isEmpty = !trimmedNewUsername;
    const isTooLong = trimmedNewUsername.length > 20;
    const hasInvalidCharacters = !/^[a-zA-Z0-9_-]+$/.test(trimmedNewUsername);
    const isSameAsCurrentUsername = trimmedNewUsername === oldUsername;

    // Validate username - empty check
    if (isEmpty) {
      boundAddToHistory({
        command: "Error: Username cannot be empty",
        isSystemMessage: true,
      });
      return;
    }

    // Validate username - length check
    if (isTooLong) {
      boundAddToHistory({
        command: "Error: Username cannot be longer than 20 characters",
        isSystemMessage: true,
      });
      return;
    }

    // Validate username - character check
    if (hasInvalidCharacters) {
      boundAddToHistory({
        command:
          "Error: Username can only contain letters, numbers, hyphens, and underscores",
        isSystemMessage: true,
      });
      return;
    }

    // Validate username - duplicate check
    if (isSameAsCurrentUsername) {
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
