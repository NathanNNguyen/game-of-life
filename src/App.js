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
  const [speed, setSpeed] = useState(1000)
  const [generation, setGeneration] = useState(0)
  const [theme, setTheme] = useState(false)
  const [toggle, setToggle] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const speedRef = useRef(speed)
  speedRef.current = speed

  const generationRef = useRef(generation)
  generationRef.current = generation

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
    setGeneration(generationRef.current + 1)
    setTimeout(runSimulation, speedRef.current)
  }, [generationRef])

  return (
    <>
      {!toggle ?
        // <div className='rules'>
        //   <h2>Game rules</h2>
        //   <h3>The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur: </h3>
        //   <p>--- Any live cell with fewer than two live neighbours dies, as if by underpopulation.</p>
        //   <p>--- Any live cell with two or three live neighbours lives on to the next generation.</p>
        //   <p>--- Any live cell with more than three live neighbours dies, as if by overpopulation.</p>
        //   <p>--- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</p>

        //   <h3>These rules, which compare the behavior of the automaton to real life, can be condensed into the following:</h3>
        //   <p>--- Any live cell with two or three live neighbours survives.</p>
        //   <p>--- Any dead cell with three live neighbours becomes a live cell.</p>
        //   <p>--- All other live cells die in the next generation. Similarly, all other dead cells stay dead.</p>
        //   <p>--- The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.</p>

        //   <button onClick={() => setToggle(!toggle)}>Exit</button>
        // </div>
        <>
          <h1>Game of Life</h1>
          <div className='game'>
            <div className='btn'>
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
              <button onClick={() => {
                setGrid(generateEmptyGrid())
                setGeneration(0)
                setRunning(false)
                setTheme(false)
                setSpeed(1000)
              }}>
                Reset
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
                Speed -
              </button>
              <button onClick={() => setSpeed(speed - 100)}>
                Speed +
              </button>
              <button onClick={() => setTheme(!theme)}>
                Theme
              </button>
              <button onClick={() => setToggle(!toggle)}>
                Rules
              </button>
            </div>
            {!theme ? <div style={{
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
                    backgroundColor: grid[i][k] ? 'white' : undefined,
                    border: 'solid .5px lightgray'
                  }} />
                ))}
            </div> :
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
                      backgroundColor: grid[i][k] ? 'royalblue' : undefined,
                      border: 'solid .5px lightgray'
                    }} />
                  ))}
              </div>}
            <>
              {!speed ? <h3>Max Speed: {speed}ms</h3> : <h3>Current Speed: {speed}ms</h3>}
              <h3>Generation: {generation}</h3>
            </>
          </div>
        </>
        :
        <div className='rules'>
          <h2>Game rules</h2>
          <h3>The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur: </h3>
          <p>--- Any live cell with fewer than two live neighbours dies, as if by underpopulation.</p>
          <p>--- Any live cell with two or three live neighbours lives on to the next generation.</p>
          <p>--- Any live cell with more than three live neighbours dies, as if by overpopulation.</p>
          <p>--- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</p>

          <h3>These rules, which compare the behavior of the automaton to real life, can be condensed into the following:</h3>
          <p>--- Any live cell with two or three live neighbours survives.</p>
          <p>--- Any dead cell with three live neighbours becomes a live cell.</p>
          <p>--- All other live cells die in the next generation. Similarly, all other dead cells stay dead.</p>
          <p>--- The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.</p>

          <button onClick={() => setToggle(!toggle)}>Exit</button>
        </div>
        // <>
        //   <h1>Game of Life</h1>
        //   <div className='game'>
        //     <div className='btn'>
        //       <button
        //         onClick={() => {
        //           setRunning(!running)
        //           if (!running) {
        //             runningRef.current = true
        //             runSimulation()
        //           }
        //         }}
        //       >
        //         {running ? 'Stop' : 'Start'}
        //       </button>
        //       <button onClick={() => {
        //         setGrid(generateEmptyGrid())
        //         setGeneration(0)
        //         setRunning(false)
        //         setTheme(false)
        //         setSpeed(1000)
        //       }}>
        //         Reset
        //       </button>
        //       <button onClick={() => {
        //         const rows = []

        //         for (let i = 0; i < numRows; i++) {
        //           rows.push(Array.from(Array(numCols), () => Math.random() > .7 ? 1 : 0))
        //         }
        //         setGrid(rows)
        //       }}>
        //         Random
        //       </button>
        //       <button onClick={() => setSpeed(speed + 100)}>
        //         Speed -
        //       </button>
        //       <button onClick={() => setSpeed(speed - 100)}>
        //         Speed +
        //       </button>
        //       <button onClick={() => setTheme(!theme)}>
        //         Theme
        //       </button>
        //       <button onClick={() => setToggle(!toggle)}>
        //         Rules
        //       </button>
        //     </div>
        //     {!theme ? <div style={{
        //       display: 'grid',
        //       gridTemplateColumns: `repeat(${numCols}, 20px)`
        //     }}>
        //       {grid.map((rows, i) =>
        //         rows.map((col, k) => <div
        //           key={`${i}_${k}`}
        //           onClick={() => {
        //             const newGrid = produce(grid, copy => {
        //               copy[i][k] = grid[i][k] ? 0 : 1
        //             })
        //             setGrid(newGrid)
        //           }}
        //           style={{
        //             width: 20,
        //             height: 20,
        //             backgroundColor: grid[i][k] ? 'white' : undefined,
        //             border: 'solid .5px lightgray'
        //           }} />
        //         ))}
        //     </div> :
        //       <div style={{
        //         display: 'grid',
        //         gridTemplateColumns: `repeat(${numCols}, 20px)`
        //       }}>
        //         {grid.map((rows, i) =>
        //           rows.map((col, k) => <div
        //             key={`${i}_${k}`}
        //             onClick={() => {
        //               const newGrid = produce(grid, copy => {
        //                 copy[i][k] = grid[i][k] ? 0 : 1
        //               })
        //               setGrid(newGrid)
        //             }}
        //             style={{
        //               width: 20,
        //               height: 20,
        //               backgroundColor: grid[i][k] ? 'royalblue' : undefined,
        //               border: 'solid .5px lightgray'
        //             }} />
        //           ))}
        //       </div>}
        //     <>
        //       {!speed ? <h3>Max Speed: {speed}ms</h3> : <h3>Current Speed: {speed}ms</h3>}
        //       <h3>Generation: {generation}</h3>
        //     </>
        //   </div>
        // </>
      }
    </>
  )
}

export default App
