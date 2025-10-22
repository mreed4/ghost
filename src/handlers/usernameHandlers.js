/* eslint-disable quote-props */
// Username-related command handlers

import { generateRandomUsername } from "../utils/terminalUtils.js";

export const createUsernameHandlers = (params) => {
  const { addToHistory, username, setUsername, setEditingUsername } = params;

  function handleUsernameCommand(command) {
    /* */
    const commands = ["edit", "new", "change", "update"];

    if (commands.includes(command)) {
      setEditingUsername(true);
      addToHistory({
        command: `Entering username editing mode...`,
        submittedUsername: username,
        isSystemMessage: true,
      });
      return;
    }

    if (command === "random") {
      /* */
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
      "  username edit|change|new|update  - Enter username editing mode",
      "  username random                  - Generate a random username",
      "",
      `Current username: ${username}`,
      "",
      "Note: edit, change, new, and update are aliases - they all do the same thing.",
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
