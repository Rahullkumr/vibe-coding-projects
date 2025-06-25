import { useState, useEffect, useRef } from 'react'
import './App.css'

const width = 8;
const candyImages = [
  'candy_01_chocolatebar_100.png',
  'candy_02_chocolatechip_100.png',
  'candy_03_darkchocolate_100.png',
  'candy_04_lollipop_100.png',
  'candy_05_candycane_100.png',
  'candy_06_jawbreaker_100.png',
  'candy_07_caramel_100.png',
  'candy_08_sourcandy_100.png',
  'candy_09_gummibear_100.png',
];

function getRandomCandy() {
  return candyImages[Math.floor(Math.random() * candyImages.length)];
}

function areAdjacent(idx1, idx2) {
  const row1 = Math.floor(idx1 / width);
  const col1 = idx1 % width;
  const row2 = Math.floor(idx2 / width);
  const col2 = idx2 % width;
  return (
    (row1 === row2 && Math.abs(col1 - col2) === 1) ||
    (col1 === col2 && Math.abs(row1 - row2) === 1)
  );
}

function findMatches(board) {
  const matches = new Set();
  // Row matches
  for (let row = 0; row < width; row++) {
    for (let col = 0; col < width - 2; col++) {
      const idx = row * width + col;
      const candy = board[idx];
      if (
        candy &&
        candy === board[idx + 1] &&
        candy === board[idx + 2]
      ) {
        matches.add(idx);
        matches.add(idx + 1);
        matches.add(idx + 2);
        let k = 3;
        while (col + k < width && board[idx + k] === candy) {
          matches.add(idx + k);
          k++;
        }
        col += k - 1;
      }
    }
  }
  // Column matches
  for (let col = 0; col < width; col++) {
    for (let row = 0; row < width - 2; row++) {
      const idx = row * width + col;
      const candy = board[idx];
      if (
        candy &&
        candy === board[idx + width] &&
        candy === board[idx + 2 * width]
      ) {
        matches.add(idx);
        matches.add(idx + width);
        matches.add(idx + 2 * width);
        let k = 3;
        while (row + k < width && board[idx + k * width] === candy) {
          matches.add(idx + k * width);
          k++;
        }
        row += k - 1;
      }
    }
  }
  return matches;
}

function App() {
  const [candies, setCandies] = useState(
    Array.from({ length: width * width }, getRandomCandy)
  );
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef();

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setGameOver(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  // Gravity and refill with scoring
  useEffect(() => {
    if (gameOver) return;
    let changed = false;
    let newCandies = [...candies];
    let totalCleared = 0;
    for (let row = width - 1; row > 0; row--) {
      for (let col = 0; col < width; col++) {
        const idx = row * width + col;
        const aboveIdx = (row - 1) * width + col;
        if (!newCandies[idx] && newCandies[aboveIdx]) {
          newCandies[idx] = newCandies[aboveIdx];
          newCandies[aboveIdx] = null;
          changed = true;
        }
      }
    }
    for (let col = 0; col < width; col++) {
      if (!newCandies[col]) {
        newCandies[col] = getRandomCandy();
        changed = true;
      }
    }
    if (changed) {
      const matches = findMatches(newCandies);
      if (matches.size > 0) {
        matches.forEach(i => {
          newCandies[i] = null;
          totalCleared++;
        });
      }
      if (totalCleared > 0) {
        setScore(s => s + totalCleared * 10);
      }
      setTimeout(() => setCandies(newCandies), 100);
    }
    // eslint-disable-next-line
  }, [candies, gameOver]);

  const handleCandyClick = (idx) => {
    if (gameOver) return;
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else if (areAdjacent(selected, idx)) {
      const newCandies = [...candies];
      [newCandies[selected], newCandies[idx]] = [newCandies[idx], newCandies[selected]];
      const matches = findMatches(newCandies);
      if (matches.size > 0) {
        let cleared = 0;
        matches.forEach(i => {
          newCandies[i] = null;
          cleared++;
        });
        setScore(s => s + cleared * 10);
        setCandies(newCandies);
      } else {
        setCandies(newCandies);
      }
      setSelected(null);
    } else {
      setSelected(idx);
    }
  };

  return (
    <>
      <div className="background-blur" />
      <div className="timer-message">
        <span>{gameOver ? "Time's up!" : `Time Left: ${timeLeft}s`}</span>
        <span style={{ marginLeft: 32 }}>Score: {score}</span>
      </div>
      <div className="candy-grid">
        {candies.map((candy, idx) => (
          <div
            key={idx}
            className={`candy${selected === idx ? ' selected' : ''}`}
            onClick={() => handleCandyClick(idx)}
          >
            {candy && (
              <img
                src={`./src/assets/candies/${candy}`}
                alt="candy"
                className="candy-img"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App
