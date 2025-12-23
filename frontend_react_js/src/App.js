import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Theme palette for Electric Orange.
 * We keep colors in JS for potential CSS-in-JS use and export CSS variables in App.css.
 */
const THEME = {
  primary: '#F97316',
  secondary: '#10B981',
  success: '#10B981',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827'
};

/**
 * Utility: calculate winner for a 3x3 tic tac toe board.
 * @param {Array<string|null>} squares - 9-length array with 'X' | 'O' | null
 * @returns {{winner: 'X'|'O'|null, line: number[]|null}}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Square component renders a clickable cell.
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight, index }) {
  /** Renders an individual square button. */
  return (
    <button
      type="button"
      aria-label={`Square ${index + 1} ${value ? 'has ' + value : 'is empty'}`}
      className={`ttt-square ${highlight ? 'ttt-square--highlight' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

/**
 * Board component renders the 3x3 grid and handles square clicks via props callback.
 */
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, highlightLine }) {
  /** Renders the 3x3 board. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((val, i) => (
        <Square
          key={i}
          index={i}
          value={val}
          onClick={() => onSquareClick(i)}
          highlight={highlightLine?.includes(i)}
        />
      ))}
    </div>
  );
}

/**
 * Main App shell: manages game state, current player, result, and restart.
 */
// PUBLIC_INTERFACE
function App() {
  /** Tic Tac Toe main application component. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const gameState = useMemo(() => {
    const { winner, line } = calculateWinner(squares);
    const isDraw = !winner && squares.every(s => s !== null);
    return {
      winner,
      line,
      isDraw,
      currentPlayer: xIsNext ? 'X' : 'O'
    };
  }, [squares, xIsNext]);

  const statusText = useMemo(() => {
    if (gameState.winner) {
      return `Winner: ${gameState.winner}`;
    }
    if (gameState.isDraw) {
      return 'Draw! No moves left.';
    }
    return `Current Player: ${gameState.currentPlayer}`;
  }, [gameState]);

  function handleSquareClick(i) {
    if (squares[i] || gameState.winner) return; // ignore if occupied or finished
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="app-shell" style={{ backgroundColor: THEME.background, color: THEME.text }}>
      <main className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="accent">Tic</span> Tac <span className="accent">Toe</span>
          </h1>
          <p
            className={`status ${
              gameState.winner ? 'status--win'
              : gameState.isDraw ? 'status--draw'
              : 'status--turn'
            }`}
            aria-live="polite"
          >
            {statusText}
          </p>
        </header>

        <section className="board-wrapper">
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            highlightLine={gameState.line}
          />
        </section>

        <footer className="controls">
          <button
            type="button"
            className="btn btn-restart"
            onClick={handleRestart}
            aria-label="Restart Game"
          >
            New Game
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
