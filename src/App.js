import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

const numRows = 30
const numCols = 30

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
  const [running, setRunning] = useState(false)
  // console.log(grid)
  const [speed, setSpeed] = useState(1000)
  console.log(speed)
  const [generation, setGeneration] = useState(0)

  const runningRef = useRef(running)
  runningRef.current = running

  const speedRef = useRef(speed)
  speedRef.current = speed

  if (speed < 0) {
    setSpeed(0)
  } else if (speed > 2000) {
    setSpeed(2000)
  }

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

    setTimeout(runSimulation, speedRef.current)
  }, [])

  return (
    <>
      <h1>Game of Life</h1>
      <div className='center'>
        <div className='btn'>
          <button
            onClick={() => {
              setRunning(!running)
              if (!running) {
                runningRef.current = true
                runSimulation()
                // play()
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
          <button onClick={() => setSpeed(speed + 100)}>
            Speed +
          </button>
          <button onClick={() => setSpeed(speed - 100)}>
            Speed -
          </button>
        </div>
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
        <div>
          <h4>Current speed: {speed}</h4>
          <h4>Generation: {generation}</h4>
        </div>
      </div>
    </>
  )
}

export default App
