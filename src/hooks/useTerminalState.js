/* eslint-disable quote-props */
// Terminal state management hook
import { useState } from "react";

export function useTerminalState() {
  // Core terminal state
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Username management state
  const [username, setUsername] = useState(
    `user${Math.floor(Math.random() * 10000)}`
  );
  const [usernameEdit, setUsernameEdit] = useState({
    isEditing: false,
    newValue: "",
  });

  // Typo correction state
  const [typoState, setTypoState] = useState({
    awaitingConfirmation: false,
    pendingCorrection: null,
    response: "",
  });

  // Helper functions for structured state updates
  const setEditingUsername = (value) => {
    setUsernameEdit((prev) => ({ ...prev, isEditing: value }));
  };

  const setNewUsername = (value) => {
    setUsernameEdit((prev) => ({ ...prev, newValue: value }));
  };

  const setAwaitingTypoConfirmation = (value) => {
    setTypoState((prev) => ({ ...prev, awaitingConfirmation: value }));
  };

  const setPendingTypoCorrection = (value) => {
    setTypoState((prev) => ({ ...prev, pendingCorrection: value }));
  };

  const setTypoResponse = (value) => {
    setTypoState((prev) => ({ ...prev, response: value }));
  };

  // Destructure state for easier access
  const { isEditing: editingUsername, newValue: newUsername } = usernameEdit;
  const {
    awaitingConfirmation: awaitingTypoConfirmation,
    pendingCorrection: pendingTypoCorrection,
    response: typoResponse,
  } = typoState;

  return {
    // Core state
    history,
    setHistory,
    inputValue,
    setInputValue,

    // Username state
    username,
    setUsername,
    editingUsername,
    newUsername,
    setEditingUsername,
    setNewUsername,

    // Typo state
    awaitingTypoConfirmation,
    pendingTypoCorrection,
    typoResponse,
    setAwaitingTypoConfirmation,
    setPendingTypoCorrection,
    setTypoResponse,
  };
}
