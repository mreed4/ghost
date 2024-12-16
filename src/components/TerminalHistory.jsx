/* eslint-disable react/prop-types */
/* eslint-disable quote-props */
// TerminalHistory
import { useTerminalContext } from "../context/TerminalContext";

function TerminalHistory() {
  const { history, editingUsername, terminalEndRef } = useTerminalContext();

  return (
    <div id="history-container">
      {history.map((item, index) => (
        <HistoryItem key={index} item={item} />
      ))}

      {editingUsername && <UsernameEditForm />}

      <div ref={terminalEndRef}></div>
    </div>
  );
}

function HistoryItem({ item }) {
  const { username } = useTerminalContext();

  if (item.isSystemMessage) {
    // Render system messages (including formatted grids for the `help` command)
    return <pre className="history-item system-message">{item.command}</pre>;
  }

  return (
    <div className="history-item">
      <span className="history-prompt">
        <span className="username">
          {item.submittedUsername || username}@ghost
        </span>
        <span className="separator">:</span>
        <span className="tilde">~</span>
        <span className="separator">$</span>
      </span>
      {item.command}
    </div>
  );
}

function UsernameEditForm() {
  const { newUsername, setNewUsername, handleUsernameChange } =
    useTerminalContext();

  return (
    <div className="history-item username-edit">
      <span className="username">&gt;</span>
      <form
        onSubmit={handleUsernameChange}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          autoFocus
          placeholder="Enter new username"
          style={{
            width: "auto",
            background: "none",
            border: "none",
            color: "#fff",
          }}
          className="input-block-cursor"
        />
      </form>
    </div>
  );
}

export default TerminalHistory;
