/* eslint-disable quote-props */
// System-related command handlers

import {
  generateRandomUptime,
  generateTestStatus,
} from "../utils/terminalUtils.js";

export const createSystemHandlers = (params) => {
  const { addToHistory, username } = params;
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
      const cpuStatus = "CPU: " + generateTestStatus(["Passed", "Failed"]);
      const ramStatus = "RAM: " + generateTestStatus(["Passed", "Failed"]);
      const storageStatus =
        "Storage: " + generateTestStatus(["Passed", "Failed"]);
      const networkStatus =
        "Network: " + generateTestStatus(["Connected", "Disconnected"]);
      const gpuStatus = "GPU: " + generateTestStatus(["Enabled", "Disabled"]);

      const testResults = [
        "Self-test results (simulated):",
        cpuStatus,
        ramStatus,
        storageStatus,
        networkStatus,
        gpuStatus,
      ].join("\n");

      addToHistory({
        command: testResults,
        submittedUsername: username,
        isSystemMessage: true,
      });
      return;
    }
  }

  function handleSystemHelp() {
    const helpText = [
      "System commands:",
      "  system test    - Run system diagnostics test",
      "  system uptime  - Show system uptime",
      "",
      "Use 'system <subcommand>' to run system operations.",
    ].join("\n");

    addToHistory({
      command: helpText,
      submittedUsername: username,
      isSystemMessage: true,
    });
  }

  return {
    handleSystemCommand,
    handleSystemHelp,
  };
};
