/* eslint-disable react/prop-types */
/* eslint-disable quote-props */
import "../Terminal.css";
import useTerminalLogic from "./TerminalLogic";
import { createContext, useContext } from "react";

// Context setup
const TerminalContext = createContext();

function TerminalProvider({ children }) {
  const terminalLogic = useTerminalLogic();
  return (
    <TerminalContext.Provider value={terminalLogic}>
      {children}
    </TerminalContext.Provider>
  );
};

function useTerminalContext() {
  return useContext(TerminalContext);
};

function Terminal() {
  return (
    <TerminalProvider>
      <div className="terminal">
        <h1 className="shimmering-title">Ghost in the Machine</h1>
        <TerminalHistory />
        <TerminalPrompt />
      </div>
    </TerminalProvider>
  );
};

function HistoryItem({ item }) {
  const { username } = useTerminalContext();

  if (item.isUsernameChange || item.isSystemMessage) {
    return <div className={`history-item system-message`}>{item.command}</div>;
  }

  return (
    <div className="history-item">
      <span className="history-prompt">
        <span className="username">{item.submittedUsername || username}@ghost</span>
        <span className="separator">:</span>
        <span className="tilde">~</span>
        <span className="separator">$</span>
      </span>
      {item.command}
    </div>
  );
};

function UsernameEditForm() {
  const { newUsername, setNewUsername, handleUsernameChange } = useTerminalContext();

  return (
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
          className="input-block-cursor"
        />
      </form>
    </div>
  );
};

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
};

function PromptUsername() {
  const { username } = useTerminalContext();

  return (
    <div className="prompt">
      <span className="username">{username}@ghost</span>
      <span className="separator">:</span>
      <span className="tilde">~</span>
      <span className="separator">$</span>
    </div>
  );
};

function PromptInput() {
  const { inputValue, setInputValue, handleCommandSubmit, inputRef } = useTerminalContext();

  return (
    <form onSubmit={handleCommandSubmit} style={{ flex: 1 }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus
        placeholder="Type a command"
        className="input-block-cursor"
      />
    </form>
  );
};

function TerminalPrompt() {
  return (
    <div className="prompt-container">
      <PromptUsername />
      <PromptInput />
    </div>
  );
};

export default Terminal;
