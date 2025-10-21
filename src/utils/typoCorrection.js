/* eslint-disable quote-props */
// Typo correction functionality

export const getTypoCorrection = (command) => {
  const typoMap = {
    // Clear command typos
    cler: "clear",
    claer: "clear",
    clera: "clear",
    claar: "clear",
    lear: "clear",

    // Help command typos
    hlep: "help",
    hepl: "help",
    hep: "help",
    halp: "help",

    // Time command typos
    tiem: "time",
    tim: "time",

    // Date command typos
    dat: "date",
    dae: "date",

    // Test command typos
    tset: "test",
    tes: "test",
    tets: "test",

    // Username command typos
    usernmae: "username",
    usernam: "username",
    usrename: "username",
    username: "username", // not a typo but ensures consistency

    // Calc command typos
    clac: "calc",
    cal: "calc",
    calcu: "calc",

    // Uptime command typos
    uptiem: "uptime",
    upitme: "uptime",
  };

  return typoMap[command.toLowerCase()] || null;
};

export const createTypoHandlers = (
  addToHistory,
  username,
  setAwaitingTypoConfirmation,
  setPendingTypoCorrection,
  setTypoResponse,
  inputRef,
  commandHandlers
) => {
  const handleTypoCorrection = (originalCommand, correctedCommand) => {
    addToHistory({
      command: `Did you mean '${correctedCommand}'? (y/n)`,
      submittedUsername: username,
      isSystemMessage: true,
    });

    // Set state to await confirmation
    setAwaitingTypoConfirmation(true);
    setPendingTypoCorrection({
      original: originalCommand,
      corrected: correctedCommand,
    });
  };

  const handleTypoConfirmation = (
    e,
    isCancelled = false,
    typoResponse,
    pendingTypoCorrection
  ) => {
    e.preventDefault();

    // Handle cancellation
    if (isCancelled) {
      addToHistory({
        command: "Typo correction cancelled",
        submittedUsername: username,
        isSystemMessage: true,
      });
      setAwaitingTypoConfirmation(false);
      setPendingTypoCorrection(null);
      setTypoResponse("");
      inputRef.current?.focus();
      return;
    }

    const response = typoResponse.trim();

    const isYes =
      response.toLowerCase() === "y" || response.toLowerCase() === "yes";
    const isNo =
      response.toLowerCase() === "n" || response.toLowerCase() === "no";

    if (isYes) {
      addToHistory({
        command: `Running: ${pendingTypoCorrection.corrected}`,
        submittedUsername: username,
        isSystemMessage: true,
      });

      // Execute the corrected command
      if (commandHandlers[pendingTypoCorrection.corrected]) {
        commandHandlers[pendingTypoCorrection.corrected]();
      }
    } else if (isNo) {
      addToHistory({
        command: `Command cancelled.`,
        submittedUsername: username,
        isSystemMessage: true,
      });
    } else {
      addToHistory({
        command: `Please enter 'y' for yes or 'n' for no.`,
        submittedUsername: username,
        isSystemMessage: true,
      });
      setTypoResponse("");
      return; // Don't reset state, keep waiting for valid response
    }

    // Reset typo correction state
    setAwaitingTypoConfirmation(false);
    setPendingTypoCorrection(null);
    setTypoResponse("");
    inputRef.current?.focus();
  };

  return { handleTypoCorrection, handleTypoConfirmation };
};
