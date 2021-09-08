import React, { useState, useCallback, useRef } from "react";
import { produce } from "immer";
import "./App.css";

const numRows = 50;
const numCols = 50;

const operation = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 1],
  [1, 0],
  [-1, 0],
];

const generateNewGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

function App() {
  const [grid, setGrid] = useState(generateNewGrid());

  const [started, setStarted] = useState(false);
  const startedRef = useRef(started);
  startedRef.current = started;

  const runSim = useCallback(() => {
    if (!startedRef.current) return;

    setGrid((currGrid) => {
      return produce(currGrid, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operation.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += currGrid[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (currGrid[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSim, 1000);
  }, []);

  return (
    <>
      <button
        style={{ width: 100, height: 100 }}
        onClick={() => {
          setStarted(!started);
          if (!started) {
            startedRef.current = true;
            runSim();
          }
        }}
      >
        {started ? "Stop" : "Start"}
      </button>
      <button
        style={{ width: 100, height: 100 }}
        onClick={() => {
          setGrid(generateNewGrid());
        }}
      >
        Clear
      </button>
      <button
        style={{ width: 100, height: 100 }}
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }
          setGrid(rows);
        }}
      >
        Random
      </button>
      <div
        className="App"
        style={{
          display: " grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, rIdx) =>
          rows.map((col, cIdx) => (
            <div
              key={`${rIdx}${cIdx}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rIdx][cIdx] = gridCopy[rIdx][cIdx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rIdx][cIdx] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
