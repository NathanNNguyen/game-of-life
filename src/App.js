import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

const numRows = 40
const numCols = 40

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
]

const generateEmptyGrid = () => {
  const rows = []

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })
  console.log(grid)
  const [running, setRunning] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }

    setGrid((g) => {
      return produce(g, copy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0
            operations.forEach(([x, y]) => {
              const newI = i + x
              const newK = k + y
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              copy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              copy[i][k] = 1
            }
          }
        }
      })
    })

    setTimeout(runSimulation, 100)
  }, [])

  return (
    <>
      <h1>Game of Life</h1>
      <div className='center'>
        <button
          onClick={() => {
            setRunning(!running)
            if (!running) {
              runningRef.current = true
              runSimulation()
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())}>
          Clear
        </button>
        <button onClick={() => {
          const rows = []

          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > .7 ? 1 : 0))
          }
          setGrid(rows)
        }}>
          Random
        </button>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}>
          {grid.map((rows, i) =>
            rows.map((col, k) => <div
              key={`${i}_${k}`}
              onClick={() => {
                const newGrid = produce(grid, copy => {
                  copy[i][k] = grid[i][k] ? 0 : 1
                })
                setGrid(newGrid)
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? 'gray' : undefined,
                border: 'solid .5px black'
              }} />
            ))}
        </div>
      </div>
    </>
  )
}

export default App
