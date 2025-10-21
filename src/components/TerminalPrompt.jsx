/* eslint-disable quote-props */
// TerminalPrompt
import { useTerminalContext } from "../context/TerminalContext";

function TerminalPrompt() {
  const { editingUsername, awaitingTypoConfirmation } = useTerminalContext();

  // Hide the regular prompt when an interactive input form is active
  const isInteractiveInputActive = editingUsername || awaitingTypoConfirmation;

  if (isInteractiveInputActive) {
    return null;
  }

  return (
    <div className="prompt-container">
      <PromptUsername />
      <PromptInput />
    </div>
  );
}

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
}

function PromptInput() {
  const { inputValue, setInputValue, handleCommandSubmit, inputRef } =
    useTerminalContext();

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
}

export default TerminalPrompt;
