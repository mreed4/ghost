// Terminal utility functions

export const generateRandomUsername = () => {
  return `user${Math.floor(Math.random() * 10000)}`;
};

export const evaluateExpression = (expression) => {
  try {
    // More strict sanitization - only allow numbers, basic operators, parentheses, and dots
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, "");

    // Check for invalid patterns
    if (
      !sanitized ||
      /[+\-*/]{2,}/.test(sanitized) ||
      /^[+*/]/.test(sanitized) ||
      /[+\-*/]$/.test(sanitized)
    ) {
      return "Invalid expression";
    }

    // Check for balanced parentheses
    let parenCount = 0;
    for (let char of sanitized) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (parenCount < 0) return "Invalid expression";
    }
    if (parenCount !== 0) return "Invalid expression";

    // Safe evaluation using Function constructor (safer than eval)
    const result = new Function("return " + sanitized)();

    // Check if result is a valid number
    if (typeof result !== "number" || !isFinite(result)) {
      return "Invalid result";
    }

    // Round to reasonable precision
    return Math.round(result * 1000000) / 1000000;
  } catch {
    return "Error";
  }
};

export const generateRandomUptime = () => {
  const days = Math.floor(Math.random() * 30);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const generateTestStatus = (statuses) => {
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const addToHistory = (setHistory, entry) => {
  if (!entry || typeof entry !== "object") {
    console.error("Invalid history entry:", entry);
    return;
  }
  setHistory((prev) => [...prev, entry]);
};
