/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import useTerminalLogic from "../components/TerminalLogic";

const TerminalContext = createContext();

export function TerminalProvider({ children }) {
  const terminalLogic = useTerminalLogic();
  return (
    <TerminalContext.Provider value={terminalLogic}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminalContext() {
  return useContext(TerminalContext);
}
