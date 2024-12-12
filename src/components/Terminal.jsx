/* eslint-disable quote-props */
import "../Terminal.css";
import useTerminalLogic from "./TerminalLogic";

const Terminal = () => {
  const {
    history,
    inputValue,
    setInputValue,
    username,
    editingUsername,
    newUsername,
    setNewUsername,
    inputRef,
    terminalEndRef,
    handleCommandSubmit,
    handleUsernameChange,
  } = useTerminalLogic();

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

export default Terminal;