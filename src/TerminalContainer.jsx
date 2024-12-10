import { useState } from "react";
import "./Terminal.css";

const TerminalContainer = () => {
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState(""); // State for the main input
  const [username, setUsername] = useState(`user${Math.floor(Math.random() * 10000)}`); // Initial username
  const [editingUsername, setEditingUsername] = useState(false); // Flag to check if editing username
  const [newUsername, setNewUsername] = useState(""); // Separate state for new username input

  // Define command handlers in an object for easy lookup
  const commandHandlers = {
    clear: () => setHistory([]),
    "username edit": () => setEditingUsername(true),
  };

  // Handle command submission
  const handleCommandSubmit = (e) => {
    e.preventDefault();

    if (inputValue.trim() !== "") {
      const command = inputValue.trim().toLowerCase();

      if (commandHandlers[command]) {
        commandHandlers[command](); // Execute the corresponding command
      } else {
        setHistory((prevHistory) => [...prevHistory, { prompt: `${username}@ghost:~$`, command: inputValue }]);
      }
      setInputValue(""); // Reset input field
    }
  };

  // Handle username change submission
  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (newUsername.trim() !== "") {
      setUsername(newUsername.trim()); // Update the username
      setEditingUsername(false); // Stop editing username
      setNewUsername(""); // Reset new username input field
    }
  };

  return (
    <div className="terminal">
      <h1 className="shimmering-title">Ghost in the Machine</h1>
      <div id="history-container">
        {/* Render history items */}
        {history.map((item, index) => (
          <div key={index} className="history-item">
            <span className="history-prompt">
              <span className="username">{username}@ghost</span>
              <span className="separator">:</span>
              <span className="tilde">~</span>
              <span className="separator">$</span>
            </span>{" "}
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
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoFocus placeholder="Type a command" />
        </form>
      </div>
    </div>
  );
};

export default TerminalContainer;
