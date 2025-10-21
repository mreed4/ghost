/* eslint-disable quote-props */
// System-related command handlers

import {
  generateRandomUptime,
  generateTestStatus,
} from "../utils/terminalUtils.js";

export const createSystemHandlers = (addToHistory, username) => {
  const handleSystemCommand = (command) => {
    if (command === "uptime") {
      const randomUptime = generateRandomUptime();
      addToHistory({
        prompt: `${username}@ghost:~$`,
        command: "system uptime",
        submittedUsername: username,
      });
      addToHistory({
        prompt: "",
        command: `System uptime (simulated): ${randomUptime}`,
        isSystemMessage: true,
      });
      return;
    }

    if (command === "test") {
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
        command: "system test",
        submittedUsername: username,
      });
      addToHistory({
        prompt: "",
        command: `Self-test results (simulated):\n${overallStatus}`,
        isSystemMessage: true,
      });
      return;
    }
  };

  const handleSystemHelp = () => {
    addToHistory({
      prompt: `${username}@ghost:~$`,
      command: "system",
      submittedUsername: username,
    });
    addToHistory({
      prompt: "",
      command: `System commands:
  system test    - Run system diagnostics test
  system uptime  - Show system uptime

Use 'system <subcommand>' to run system operations.`,
      isSystemMessage: true,
    });
  };

  return {
    handleSystemCommand,
    handleSystemHelp,
  };
};
