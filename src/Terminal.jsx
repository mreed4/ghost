/* eslint-disable react/prop-types */

const Terminal = ({ history, inputValue, onInputChange, onKeyDown, onScroll, onThumbDrag, historyRef, thumbRef }) => (
  <div className="terminal">
    <div id="history-container" ref={historyRef} onScroll={onScroll}>
      {history.map((item, index) => (
        <div key={index} className="history-item">
          {item}
        </div>
      ))}
    </div>
    <div className="custom-scrollbar">
      <div className="scroll-thumb" ref={thumbRef} onMouseDown={onThumbDrag}></div>
    </div>
    <div className="prompt-container">
      <span className="prompt">&gt;</span>
      <input type="text" value={inputValue} onChange={onInputChange} onKeyDown={onKeyDown} autoFocus />
    </div>
  </div>
);

export default Terminal;
