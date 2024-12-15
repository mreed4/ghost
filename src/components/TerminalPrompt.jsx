/* eslint-disable quote-props */
import { useTerminalContext } from '../context/TerminalContext';

function TerminalPrompt() {
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
