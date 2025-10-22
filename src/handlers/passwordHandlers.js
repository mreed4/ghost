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

    // Default values
    let length = 12;
    let options = {
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
    };

    // Parse arguments
    for (let i = 0; i < argsArray.length; i++) {
      const arg = argsArray[i];

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
              command: `Error: Unknown option '${arg}'. Type 'password help' for usage.`,
              submittedUsername: username,
              isSystemMessage: true,
            });
            return;
        }
      }
      // Check for help
      else if (arg === "help") {
        handlePasswordHelp();
        return;
      } else {
        addToHistory({
          command: `Error: Invalid argument '${arg}'. Type 'password help' for usage.`,
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

    addToHistory({
      command: `Generated Password: ${password}

Length: ${length} characters
Character types: ${charTypes.join(", ")}
Strength: ${strength}
${
  options.excludeSimilar
    ? "Similar characters excluded (i, l, 1, L, o, 0, O)"
    : ""
}

⚠️  Remember to store this password securely!`,
      submittedUsername: username,
      isSystemMessage: true,
    });
  };

  const handlePasswordHelp = () => {
    addToHistory({
      command: `Password Generator Help:

Usage: password [length] [options]

Arguments:
  [length]              Password length (4-128, default: 12)

Options:
  --no-uppercase        Exclude uppercase letters (A-Z)
  --no-lowercase        Exclude lowercase letters (a-z)
  --no-numbers          Exclude numbers (0-9)
  --no-symbols          Exclude symbols (!@#$%^&*...)
  --exclude-similar     Exclude similar characters (i,l,1,L,o,0,O)

Examples:
  password                          Generate 12-character password
  password 16                       Generate 16-character password
  password 8 --no-symbols           8 chars, no symbols
  password 20 --exclude-similar     20 chars, exclude similar chars
  password help                     Show this help

Default: 12 characters with uppercase, lowercase, numbers, and symbols`,
      submittedUsername: username,
      isSystemMessage: true,
    });
  };

  return {
    handlePasswordCommand,
    handlePasswordHelp,
  };
};
