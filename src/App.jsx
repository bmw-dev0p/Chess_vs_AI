import React, { useState } from "react";
import ChessGame from "./Chessboard";
import "./App.css";

function App() {
  const [mode, setMode] = useState(null);

  return (
    <div className="App">
      <h1>Chess AI Game</h1>
      {mode ? (
        // aiMode={mode} 
        <ChessGame />
      ) : (
        <div>
          <button onClick={() => setMode("human")}>Play Yourself</button>
          <button onClick={() => setMode("easy")}>Play Computer (Easy)</button>
          <button onClick={() => setMode("medium")}>Play Computer (Medium)</button>
          <button onClick={() => setMode("hard")}>Play Computer (Hard)</button>
        </div>
      )}
    </div>
  );
}

export default App;
