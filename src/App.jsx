import React, { useState } from "react";
import ChessGame from "./Chessboard";
import "./App.css";

function App() {
  const [mode, setMode] = useState(null);

  function selectMode(selectedMode) {
    console.log(`Game Mode Selected: ${selectedMode}`);
    setMode(selectedMode);
  }

  return (
    <div className="container">
      {mode ? (
        <ChessGame aiMode={mode} />
      ) : (
        <div>
          <button onClick={() => selectMode("human")}>Play Yourself</button>
          <button onClick={() => selectMode("easy")}>Play Computer (Easy)</button>
          <button onClick={() => selectMode("medium")}>Play Computer (Medium)</button>
          <button onClick={() => selectMode("hard")}>Play Computer (Hard)</button>
        </div>
      )}
    </div>
  );
}


export default App;
