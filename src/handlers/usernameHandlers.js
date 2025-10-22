/* eslint-disable quote-props */
// Username-related command handlers

import { generateRandomUsername } from "../utils/terminalUtils.js";

export const createUsernameHandlers = (params) => {
  const { addToHistory, username, setUsername } = params;

  function handleUsernameCommand(command, newUsernameArg) {
    const commands = ["edit", "new", "change", "update"];

    if (commands.includes(command)) {
      if (!newUsernameArg || newUsernameArg.trim() === "") {
        addToHistory({
          command: `Usage: username ${command} <new_username>`,
          submittedUsername: username,
          isSystemMessage: true,
        });
        return;
      }

      const trimmedNewUsername = newUsernameArg.trim();
      const oldUsername = username;

      // Validate username
      if (trimmedNewUsername.length > 20) {
        addToHistory({
          command: "Error: Username cannot be longer than 20 characters",
          submittedUsername: username,
          isSystemMessage: true,
        });
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(trimmedNewUsername)) {
        addToHistory({
          command:
            "Error: Username can only contain letters, numbers, hyphens, and underscores",
          submittedUsername: username,
          isSystemMessage: true,
        });
        return;
      }

      if (trimmedNewUsername === oldUsername) {
        addToHistory({
          command: "Error: New username is the same as current username",
          submittedUsername: username,
          isSystemMessage: true,
        });
        return;
      }

      // Update username
      addToHistory({
        command: `Username changed from ${oldUsername} to ${trimmedNewUsername}`,
        submittedUsername: oldUsername,
        isUsernameChange: true,
        isSystemMessage: true,
      });
      setUsername(trimmedNewUsername);
      return;
    }

    if (command === "random") {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();

      addToHistory({
        command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`,
        submittedUsername: oldUsername,
        isUsernameChange: true,
        isSystemMessage: true,
      });
      setUsername(newRandomUsername);
    }
  }

  function handleUsernameHelp() {
    const helpText = [
      "Username commands:",
      "  username edit|change|new|update <username>  - Change username",
      "  username random                             - Generate a random username",
      "",
      `Current username: ${username}`,
      "",
      "Examples:",
      "  username new alice",
      "  username edit bob123",
      "  username random",
    ].join("\n");

    addToHistory({
      command: helpText,
      submittedUsername: username,
      isSystemMessage: true,
    });
  }

  return {
    handleUsernameCommand,
    handleUsernameHelp,
  };
};
