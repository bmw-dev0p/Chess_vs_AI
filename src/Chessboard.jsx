import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./App.css"; // Import styles

function ChessGame({ aiMode }) {
  const [game, setGame] = useState(new Chess());
  const [captured, setCaptured] = useState({ w: [], b: [] });
  const [message, setMessage] = useState(""); // ✅ State for error/check messages
  const [moveHistory, setMoveHistory] = useState([]);  // ✅ Track full move history
  const [capturedValue, setCapturedValue] = useState({ w: 0, b: 0 });  // Track piece value captured


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

    // ✅ Update move history (add new move to the array)
    const moveNotation = `${move.color === "w" ? "White" : "Black"} ${move.piece.toUpperCase()} ${move.from} > ${move.to}`;
    setMoveHistory(prev => [moveNotation, ...prev]);  // Push new moves to the top
    console.log(`Move: ${moveNotation}`);

    // ✅ Track captured pieces
    if (move.captured) {
      const pieceValue = pieceValues[move.captured] || 0;
      setCaptured(prev => ({
        ...prev,
        [move.color]: [...prev[move.color], move.captured]
      }));
      setCapturedValue(prev => ({
        ...prev,
        [move.color]: prev[move.color] + pieceValue
      }));

      console.log(`Capture: ${move.color === "w" ? "White" : "Black"} captured ${move.captured.toUpperCase()} at ${move.to} (Value: ${pieceValue} points)`);
    }

    // ✅ Check for mate
    if (gameCopy.isCheckmate()) {
      setGame(new Chess(gameCopy.fen()));  // ✅ Force board update before stopping
      setMessage(`Checkmate! ${move.color === "w" ? "White" : "Black"} wins!`);
      console.log(`Game Over: Checkmate! ${move.color === "w" ? "White" : "Black"} wins!`);
      return;
    }

    // ✅ Check for draw
    if (gameCopy.isDraw()) {
      setGame(new Chess(gameCopy.fen()));  // ✅ Force board update before stopping
      setMessage("Game Over: It's a Draw!");
      console.log("Game Over: Draw!");
      return;
    }
    
    // ✅ Check if the opponent is now in check
    if (gameCopy.inCheck()) {
      console.log(`${gameCopy.turn() === "w" ? "White" : "Black"} is in CHECK!`);
      setMessage(`${gameCopy.turn() === "w" ? "White" : "Black"} is in Check!`);
    } else {
      setMessage(""); // Clear message if no special condition
    }

    setGame(gameCopy);

    // ✅ AI only moves if it's an AI mode (not "human")
    if (aiMode !== "human" && gameCopy.turn() === "b") {
      setTimeout(() => aiMove(gameCopy, aiMode), 500);
    }


    return true;
  }

  function aiMove(gameState, aiMode) {
    const possibleMoves = gameState.moves({ verbose: true });

    if (possibleMoves.length === 0) return; // Game over

    let bestMove = null;

    if (aiMode === "medium") {
      // Capture-Priority AI: Look for moves that capture a piece
      const captureMoves = possibleMoves.filter(move => move.captured);

      if (captureMoves.length > 0) {
        // Pick the best capture move (highest value piece)
        bestMove = captureMoves.reduce((best, move) => {
          const value = pieceValues[move.captured] || 0;
          return value > (pieceValues[best?.captured] || 0) ? move : best;
        }, captureMoves[0]);
      }
    }

    // If no capturing move found, or AI is Easy mode, pick a random move
    if (!bestMove) {
      bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    // Log AI decision
    // we want to log BEFORE updating the game state - for debugging
    console.log(`AI (${aiMode}) Move: Black ${bestMove.piece.toUpperCase()} ${bestMove.from} > ${bestMove.to}`);
    // Log capture
    if (bestMove.captured) {
      console.log(`AI captured: ${bestMove.captured.toUpperCase()} at ${bestMove.to}`);
    }

    // ✅ Update game state with AI move
    gameState.move(bestMove);

    // ✅ Append move history
    const moveNotation = `Black ${bestMove.piece.toUpperCase()} ${bestMove.from} > ${bestMove.to}`;
    setMoveHistory(prev => [moveNotation, ...prev]);  // ✅ Append AI move

    setGame(new Chess(gameState.fen()));
  }




  function getScore(color) {
    const score = captured[color].reduce((total, piece) => total + (pieceValues[piece] || 0), 0);
    console.log(`${color === "w" ? "White" : "Black"} Score: ${score}`);
    return score;
  }

  return (
    <div className="game-container">
      <div className="sidebar">
        <h1>Chess IQ</h1>

        <div className="score-box">
          <div className="score-row">
            <span className="score-label">White</span>
            <span className="score-value">{capturedValue.b} pts</span>
          </div>
          <div className="score-row divider">
            <span className="score-label">Black</span>
            <span className="score-value">{capturedValue.w} pts</span>
          </div>
        </div>

        <div className="move-history">
          {/* <h2>Move History</h2> */}
          <div className="history-box">
            {moveHistory.length === 0 ? <p>You are white. Move a piece to start the game!</p> :
              moveHistory.map((move, index) => {
                const moveNumber = moveHistory.length - index;  // Calculate correct move number
                return <p key={index}>{moveNumber}. {move}</p>;
              })
            }
          </div>
        </div>
        <h2 className={`message ${message ? "error" : ""}`}>{message}</h2>
      </div>
      <div className="chessboard-container">
        <Chessboard position={game.fen()} onPieceDrop={handleMove} />
      </div>
    </div>
  );




}

export default ChessGame;
