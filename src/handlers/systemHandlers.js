/* eslint-disable quote-props */
// System-related command handlers

import {
  generateRandomUptime,
  generateTestStatus,
} from "../utils/terminalUtils.js";

export const createSystemHandlers = (addToHistory, username) => {
  function handleSystemCommand(command) {
    if (command === "uptime") {
      const randomUptime = generateRandomUptime();
      addToHistory({
        command: `System uptime (simulated): ${randomUptime}`,
        submittedUsername: username,
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
        command: `Self-test results (simulated):\n${overallStatus}`,
        submittedUsername: username,
        isSystemMessage: true,
      });
      return;
    }
  }

  function handleSystemHelp() {
    addToHistory({
      command: `System commands:
  system test    - Run system diagnostics test
  system uptime  - Show system uptime

Use 'system <subcommand>' to run system operations.`,
      submittedUsername: username,
      isSystemMessage: true,
    });
  }

  return {
    handleSystemCommand,
    handleSystemHelp,
  };
};
