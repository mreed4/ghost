/* eslint-disable quote-props */
// Username-related command handlers

import { generateRandomUsername } from "../utils/terminalUtils.js";

export const createUsernameHandlers = (
  addToHistory,
  username,
  setUsername,
  setEditingUsername
) => {
  function handleUsernameCommand(command) {
    const commands = ["edit", "new", "change", "update"];
    if (commands.includes(command)) {
      setEditingUsername(true);
      addToHistory({
        command: `username ${command}`,
        submittedUsername: username,
      });
      return;
    }
    if (command === "random") {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();
      addToHistory({
        command: "username random",
        submittedUsername: oldUsername,
      });
      addToHistory({
        command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`,
        isUsernameChange: true,
        isSystemMessage: true,
      });
      setUsername(newRandomUsername);
    }
  }

  function handleUsernameHelp() {
    addToHistory({
      command: "username",
      submittedUsername: username,
    });
    addToHistory({
      command: `Username commands:
  username edit|change|new|update  - Enter username editing mode
  username random                  - Generate a random username

Current username: ${username}

Note: edit, change, new, and update are aliases - they all do the same thing.`,
      isSystemMessage: true,
    });
  }

  return {
    handleUsernameCommand,
    handleUsernameHelp,
  };
};
