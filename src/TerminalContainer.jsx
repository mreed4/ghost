import { useState, useRef } from "react";
import "./Terminal.css";

const TerminalContainer = () => {
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState(""); // State for the main input
  const [username, setUsername] = useState(`user${Math.floor(Math.random() * 10000)}`); // Initial username
  const [editingUsername, setEditingUsername] = useState(false); // Flag to check if editing username
  const [newUsername, setNewUsername] = useState(""); // Separate state for new username input

  // Create a ref for the main input field
  const inputRef = useRef(null);

  // Function to generate a random username
  const generateRandomUsername = () => {
    return `user${Math.floor(Math.random() * 10000)}`;
  };

  // Define command handlers in an object for easy lookup
  const commandHandlers = {
    clear: () => setHistory([]),
    "username edit": () => {
      setEditingUsername(true);
      // Add the current username as part of the "username edit" command history
      setHistory((prevHistory) => [
        ...prevHistory,
        { prompt: `${username}@ghost:~$`, command: "username edit", submittedUsername: username },
      ]);
    },
    "username random": () => {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();
      setUsername(newRandomUsername); // Set the new random username

      // Add random username change to history
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          prompt: "",
          command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`,
          isUsernameChange: true, // Mark this as a username change
        },
      ]);
    },
  };

  // Handle command submission
  const handleCommandSubmit = (e) => {
    e.preventDefault();

    if (inputValue.trim() !== "") {
      const command = inputValue.trim().toLowerCase();

      // If a command is recognized, execute it
      if (commandHandlers[command]) {
        commandHandlers[command]();
      } else {
        // For other commands, add them to history with the correct username at submission time
        setHistory((prevHistory) => [
          ...prevHistory,
          { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username }, // Store username at the time of submission
        ]);
      }

      setInputValue(""); // Reset input field
    }
  };

  // Handle username change submission
  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (newUsername.trim() !== "") {
      const oldUsername = username;
      setUsername(newUsername.trim()); // Update the username
      setEditingUsername(false); // Stop editing username
      setNewUsername(""); // Reset new username input field
      inputRef.current.focus(); // Focus back to the main input

      // Add username change history item
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          prompt: "",
          command: `Username changed from ${oldUsername} to ${newUsername.trim()}`,
          isUsernameChange: true, // Mark this as a username change
        },
      ]);
    }
  };

  return (
    <div className="terminal">
      <h1 className="shimmering-title">Ghost in the Machine</h1>
      <div id="history-container">
        {/* Render history items */}
        {history.map((item, index) => (
          <div key={index} className={`history-item ${item.isUsernameChange ? "system-message" : ""}`}>
            {/* Only render the username prompt if it's not a username change */}
            {!item.isUsernameChange && (
              <span className="history-prompt">
                <span className="username">{item.submittedUsername || username}@ghost</span>{" "}
                {/* Use the username stored at the time of submission */}
                <span className="separator">:</span>
                <span className="tilde">~</span>
                <span className="separator">$</span>
              </span>
            )}
            {item.command}
          </div>
        ))}

        {/* New prompt for username edit */}
        {editingUsername && (
          <div className="history-item username-edit">
            <span className="username">&gt;</span> {/* New prompt without user@host */}
            <form onSubmit={handleUsernameChange} style={{ display: "inline-flex", alignItems: "center" }}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                autoFocus
                placeholder="Enter new username"
                style={{ width: "auto", background: "none", border: "none", color: "#fff" }}
              />
            </form>
          </div>
        )}
      </div>

      <div className="prompt-container">
        <div className="prompt">
          <span className="username">{username}@ghost</span>
          <span className="separator">:</span>
          <span className="tilde">~</span>
          <span className="separator">$</span>
        </div>

        <form onSubmit={handleCommandSubmit} style={{ flex: 1 }}>
          <input
            ref={inputRef} // Attach ref to the input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            placeholder="Type a command"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalContainer;
