import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./App.css"; // Import styles

function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [captured, setCaptured] = useState({ w: [], b: [] });
  const [message, setMessage] = useState(""); // ✅ State for error/check messages

  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };

  function handleMove(sourceSquare, targetSquare) {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());

    // ✅ Check if it's the correct player's turn
    if (game.turn() === "w" && game.get(sourceSquare)?.color !== "w") {
      setMessage("Invalid Move - It's White's Turn!");
      return false;
    }
    if (game.turn() === "b" && game.get(sourceSquare)?.color !== "b") {
      setMessage("Invalid Move - It's Black's Turn!");
      return false;
    }

    // ✅ Get all legal moves
    const legalMoves = game.moves({ verbose: true }).map(m => ({ from: m.from, to: m.to }));
    const isLegal = legalMoves.some(m => m.from === sourceSquare && m.to === targetSquare);

    if (!isLegal) {
      setMessage("Invalid Move!");
      return false;
    }

    // ✅ Attempt move
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Auto-promote to queen
    });

    if (!move) {
      setMessage("Invalid Move - Must Protect King!");
      return false;
    }

    // ✅ Check if the opponent is now in check
    if (gameCopy.inCheck()) {
      setMessage(`${gameCopy.turn() === "w" ? "White" : "Black"} is in Check!`);
    } else {
      setMessage(""); // Clear message if no special condition
    }

    // ✅ Track captured pieces
    if (move.captured) {
      setCaptured(prev => ({
        ...prev,
        [move.color]: [...prev[move.color], move.captured]
      }));
    }

    setGame(gameCopy);
    return true;
  }

  function getScore(color) {
    return captured[color].reduce((total, piece) => total + (pieceValues[piece] || 0), 0);
  }

  return (
    <div className="App">
      <h2 className="score">White: {getScore("b")} | Black: {getScore("w")}</h2>
      <div className="chessboard-container">
        <Chessboard position={game.fen()} onPieceDrop={handleMove} />
      </div>
      {/* ✅ Display message on screen */}
      <h2 className={`message ${message ? "error" : ""}`}>{message}</h2>
    </div>
  );
}

export default ChessGame;
