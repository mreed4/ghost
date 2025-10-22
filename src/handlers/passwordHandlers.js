/* eslint-disable quote-props */
// Password generation handlers
export const createPasswordHandlers = ({ addToHistory, username }) => {
  const generatePassword = (length = 12, options = {}) => {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = false,
    } = options;

    let charset = "";

    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Remove similar looking characters if requested
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    if (charset === "") {
      return "Error: No character types selected for password generation.";
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  };

  const handlePasswordCommand = (args) => {
    const argsArray = args
      .trim()
      .split(/\s+/)
      .filter((arg) => arg);

    // If no arguments, show help
    if (argsArray.length === 0) {
      handlePasswordHelp();
      return;
    }

    const subCommand = argsArray[0];
    const remainingArgs = argsArray.slice(1);

    // Check for valid subcommands
    if (
      subCommand !== "new" &&
      subCommand !== "gen" &&
      subCommand !== "generate"
    ) {
      addToHistory({
        command: `Error: Invalid subcommand '${subCommand}'. Use 'password new' or 'password gen' to generate passwords.`,
        submittedUsername: username,
        isSystemMessage: true,
      });
      return;
    }

    // Parse remaining arguments for password generation
    let length = 12;
    let options = {
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
    };

    // Parse arguments
    for (let i = 0; i < remainingArgs.length; i++) {
      const arg = remainingArgs[i];

      // Check for length (number)
      if (/^\d+$/.test(arg)) {
        const parsedLength = parseInt(arg);
        if (parsedLength >= 4 && parsedLength <= 128) {
          length = parsedLength;
        } else {
          addToHistory({
            command:
              "Error: Password length must be between 4 and 128 characters.",
            submittedUsername: username,
            isSystemMessage: true,
          });
          return;
        }
      }
      // Check for options
      else if (arg.startsWith("--")) {
        switch (arg) {
          case "--no-uppercase":
            options.includeUppercase = false;
            break;
          case "--no-lowercase":
            options.includeLowercase = false;
            break;
          case "--no-numbers":
            options.includeNumbers = false;
            break;
          case "--no-symbols":
            options.includeSymbols = false;
            break;
          case "--exclude-similar":
            options.excludeSimilar = true;
            break;
          default:
            addToHistory({
              command: `Error: Unknown option '${arg}'. Type 'password' for usage.`,
              submittedUsername: username,
              isSystemMessage: true,
            });
            return;
        }
      } else {
        addToHistory({
          command: `Error: Invalid argument '${arg}'. Type 'password' for usage.`,
          submittedUsername: username,
          isSystemMessage: true,
        });
        return;
      }
    }

    // Generate password
    const password = generatePassword(length, options);

    if (password.startsWith("Error:")) {
      addToHistory({
        command: password,
        submittedUsername: username,
        isSystemMessage: true,
      });
      return;
    }

    // Calculate password strength
    let strength = "Weak";
    if (length >= 8 && Object.values(options).filter(Boolean).length >= 3) {
      strength = "Medium";
    }
    if (length >= 12 && Object.values(options).filter(Boolean).length >= 4) {
      strength = "Strong";
    }
    if (length >= 16 && Object.values(options).filter(Boolean).length >= 4) {
      strength = "Very Strong";
    }

    // Build character set info
    const charTypes = [];
    if (options.includeLowercase) charTypes.push("lowercase");
    if (options.includeUppercase) charTypes.push("uppercase");
    if (options.includeNumbers) charTypes.push("numbers");
    if (options.includeSymbols) charTypes.push("symbols");

    // Copy password to clipboard
    let clipboardMessage = "";
    try {
      navigator.clipboard.writeText(password);
      clipboardMessage = "Password copied to clipboard!";
    } catch {
      clipboardMessage =
        "Could not copy to clipboard (requires HTTPS or localhost)";
    }

    const passwordMessage = [
      `Generated Password: ${password}`,
      "\n",
      `Length: ${length} characters`,
      `Character types: ${charTypes.join(", ")}`,
      `Strength: ${strength}`,
      options.excludeSimilar
        ? "Similar characters excluded (i, l, 1, L, o, 0, O)"
        : "",
      "",
      clipboardMessage,
      "Remember to store this password securely!",
    ]
      .filter((line) => line !== "") // Remove empty lines from conditional content
      .join("\n");

    addToHistory({
      command: passwordMessage,
      submittedUsername: username,
      isSystemMessage: true,
    });
  };

  const handlePasswordHelp = () => {
    const helpMessage = [
      "Password Generator Help:",
      "",
      "Usage: password <subcommand> [length] [options]",
      "",
      "Subcommands:",
      "  new, gen, generate    Generate a new password",
      "",
      "Arguments:",
      "  [length]              Password length (4-128, default: 12)",
      "",
      "Options:",
      "  --no-uppercase        Exclude uppercase letters (A-Z)",
      "  --no-lowercase        Exclude lowercase letters (a-z)",
      "  --no-numbers          Exclude numbers (0-9)",
      "  --no-symbols          Exclude symbols (!@#$%^&*...)",
      "  --exclude-similar     Exclude similar characters (i,l,1,L,o,0,O)",
      "",
      "Examples:",
      "  password                          Show this help",
      "  password new                      Generate 12-character password",
      "  password gen 16                   Generate 16-character password",
      "  password new 8 --no-symbols       8 chars, no symbols",
      "  password gen 20 --exclude-similar 20 chars, exclude similar chars",
      "",
      "Default: 12 characters with uppercase, lowercase, numbers, and symbols",
    ].join("\n");

    addToHistory({
      command: helpMessage,
      submittedUsername: username,
      isSystemMessage: true,
    });
  };

  return {
    handlePasswordCommand,
  };
};
