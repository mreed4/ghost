/* eslint-disable quote-props */
// Username-related command handlers

import { generateRandomUsername } from "../utils/terminalUtils.js";

export const createUsernameHandlers = (
  addToHistory,
  username,
  setUsername,
  setEditingUsername
) => {
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

  return {
    handleUsernameCommand,
    handleUsernameHelp,
  };
};
