// src/components/Game.js

import React, { useState, useMemo, useEffect } from 'react';
import Board from './Board';

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const startingPlayer = Math.random() < 0.5 ? 'X' : 'O';
    setIsXNext(startingPlayer === 'X');
  }, []);

  const calculateWinner = useMemo(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return (squares) => {
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    };
  }, []);

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next Player: ${isXNext ? 'X' : 'O'}`;

  const handleClick = (index) => {
    const newSquares = squares.slice();
    if (newSquares[index] || winner) return;

    newSquares[index] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setHistory([...history, newSquares]);
    setIsXNext(!isXNext);
  };

  return (
    <div className="game">
      <div className="game-board-container">
        <div className="game-board">
          <h1>Tic-Tac-Toe</h1>
          <div className="status">{status}</div>
          <Board squares={squares} onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default Game;
