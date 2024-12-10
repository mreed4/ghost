import { useState } from "react";
import "./Terminal.css";

const TerminalContainer = () => {
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username] = useState(`user${Math.floor(Math.random() * 10000)}`);
  const [isGlowing, setIsGlowing] = useState(false); // Track if glow effect is active

  // Handle command submission
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const command = inputValue.trim();

    // Check if the command is "clear"
    if (command.toLowerCase() === "clear") {
      setHistory([]); // Clear history
    }

    // Check if the command is not empty (and not clear)
    if (command !== "" && command.toLowerCase() !== "clear") {
      setHistory((prevHistory) => [...prevHistory, { prompt: `${username}@ghost:~$`, command }]);
    }

    setInputValue(""); // Reset input field
  };

  const handleKeyPress = () => {
    setIsGlowing(true);
    // Automatically remove glowing effect after 0.5s (duration of glow)
    setTimeout(() => setIsGlowing(false), 500);
  };

  return (
    <div className="terminal">
      <h1 className={`shimmering-title ${isGlowing ? "glowing" : ""}`}>Ghost in the Machine</h1>
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
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            placeholder="Type a command"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalContainer;
