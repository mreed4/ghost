import { useState, useRef, useEffect } from "react";
import "./Terminal.css";

const TerminalContainer = () => {
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState(`user${Math.floor(Math.random() * 10000)}`);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const generateRandomUsername = () => `user${Math.floor(Math.random() * 10000)}`;

  const evaluateExpression = (expression) => {
    try {
      // Ensure the input is strictly a basic arithmetic expression
      const sanitizedExpression = expression.replace(/[^0-9+\-*/(). ]/g, "");

      const result = eval(sanitizedExpression);
      return result !== undefined ? result : "Error";
    } catch {
      return "Error";
    }
  };

  const commandHandlers = {
    clear: () => setHistory([]),
    "username edit": () => {
      setEditingUsername(true);
      setHistory((prev) => [...prev, { prompt: `${username}@ghost:~$`, command: "username edit", submittedUsername: username }]);
    },
    "username random": () => {
      const oldUsername = username;
      const newRandomUsername = generateRandomUsername();
      setUsername(newRandomUsername);
      setHistory((prev) => [
        ...prev,
        { prompt: `${username}@ghost:~$`, command: "username random", submittedUsername: username },
        { prompt: "", command: `Username changed randomly from ${oldUsername} to ${newRandomUsername}`, isUsernameChange: true },
      ]);
    },
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const command = inputValue.trim().toLowerCase();

      if (commandHandlers[command]) {
        commandHandlers[command]();
      } else if (command.startsWith("calc ")) {
        const expression = command.slice(5).trim();
        const result = evaluateExpression(expression);
        setHistory((prev) => [
          ...prev,
          { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username },
          { prompt: "", command: `Result: ${result}`, isUsernameChange: true },
        ]);
      } else {
        const result = evaluateExpression(command);
        if (!isNaN(result)) {
          setHistory((prev) => [
            ...prev,
            { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username },
            { prompt: "", command: `Result: ${result}`, isUsernameChange: true },
          ]);
        } else {
          setHistory((prev) => [...prev, { prompt: `${username}@ghost:~$`, command: inputValue, submittedUsername: username }]);
        }
      }
      setInputValue("");
    }
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (newUsername.trim() !== "") {
      const oldUsername = username;
      setUsername(newUsername.trim());
      setEditingUsername(false);
      setNewUsername("");
      inputRef.current.focus();
      setHistory((prev) => [
        ...prev,
        { prompt: "", command: `Username changed from ${oldUsername} to ${newUsername.trim()}`, isUsernameChange: true },
      ]);
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, editingUsername]);

  return (
    <div className="terminal">
      <h1 className="shimmering-title">Ghost in the Machine</h1>

      <div id="history-container">
        {history.map((item, index) => (
          <div key={index} className={`history-item ${item.isUsernameChange ? "system-message" : ""}`}>
            {!item.isUsernameChange && (
              <span className="history-prompt">
                <span className="username">{item.submittedUsername || username}@ghost</span>
                <span className="separator">:</span>
                <span className="tilde">~</span>
                <span className="separator">$</span>
              </span>
            )}
            {item.command}
          </div>
        ))}

        {editingUsername && (
          <div className="history-item username-edit">
            <span className="username">&gt;</span>
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
        <div ref={terminalEndRef}></div>
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
            ref={inputRef}
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
