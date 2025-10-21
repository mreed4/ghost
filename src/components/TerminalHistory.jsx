/* eslint-disable react/prop-types */
/* eslint-disable quote-props */
// TerminalHistory
import { useTerminalContext } from "../context/TerminalContext";

function TerminalHistory() {
  const { history, editingUsername, awaitingTypoConfirmation, terminalEndRef } =
    useTerminalContext();

  return (
    <div id="history-container">
      {history.map((item, index) => (
        <HistoryItem key={index} item={item} />
      ))}

      {editingUsername && <UsernameEditForm />}
      {awaitingTypoConfirmation && <TypoConfirmationForm />}

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

// Abstracted interactive input form component
function InteractiveInputForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  className = "",
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className={`history-item ${className}`}>
      <span className="username">&gt;</span>
      <form onSubmit={onSubmit} className="interactive-form">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder={placeholder}
          className="input-block-cursor interactive-input"
        />
      </form>
    </div>
  );
}

function UsernameEditForm() {
  const { newUsername, setNewUsername, handleUsernameChange } =
    useTerminalContext();

  const handleCancel = () => {
    handleUsernameChange(
      { preventDefault: () => {}, target: { value: "" } },
      true
    );
  };

  return (
    <InteractiveInputForm
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
      onSubmit={handleUsernameChange}
      onCancel={handleCancel}
      placeholder="Enter new username (ESC to cancel)"
      className="username-edit"
    />
  );
}

function TypoConfirmationForm() {
  const { typoResponse, setTypoResponse, handleTypoConfirmation } =
    useTerminalContext();

  const handleCancel = () => {
    handleTypoConfirmation({ preventDefault: () => {} }, true);
  };

  return (
    <InteractiveInputForm
      value={typoResponse}
      onChange={(e) => setTypoResponse(e.target.value)}
      onSubmit={handleTypoConfirmation}
      onCancel={handleCancel}
      placeholder="y/n (ESC to cancel)"
      className="typo-confirmation"
    />
  );
}

export default TerminalHistory;
