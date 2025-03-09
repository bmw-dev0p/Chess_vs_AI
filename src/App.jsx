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
    <div className={mode ? "container" : "homepage"}>
      {mode ? (
        <ChessGame aiMode={mode} />
      ) : (
        <div className="homepage-content">
          <h1 className="title">Chess IQ</h1>
          <h2 className="subtitle">A strategic chess experience powered by AI </h2>
          <div className="button-group">
            <button onClick={() => selectMode("human")}>Play Yourself</button>
            <button onClick={() => selectMode("easy")}>Play Computer (Easy)</button>
            <button onClick={() => selectMode("medium")}>Play Computer (Medium)</button>
            <button onClick={() => selectMode("hard")}>Play Computer (Hard)</button>
          </div>
          <h2 className="subtitle">Select a game mode to begin</h2>
          <h2 className="subtitle">Made by: bmw</h2>
        </div>
      )}
    </div>
  );
}


export default App;
