import '../Terminal.css';
import { TerminalProvider } from '../context/TerminalContext';
import TerminalHistory from './TerminalHistory';
import TerminalPrompt from './TerminalPrompt';

const Terminal = () => {
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

export default Terminal;
