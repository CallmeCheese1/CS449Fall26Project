import { useState } from 'react'
import { CellState, Game, GameStatus, type BoardType, type Coordinate } from './game'
import { GameBoard } from './components/GameBoard'
import { GameHeader } from './components/GameHeader'
import { GameSetupPanel } from './components/GameSetupPanel'
import { GameStatePanel } from './components/GameStatePanel'

function App() {
  const [size, setSize] = useState('7')
  const [boardType, setBoardType] = useState<BoardType>('english')
  const [game, setGame] = useState<Game>(() => new Game(7, 'english'))
  const [selected, setSelected] = useState<Coordinate | null>(null)
  const [, refresh] = useState(0)
  const numericSize = Number(size)
  const isValidSize = Number.isInteger(numericSize) && numericSize >= 7 && numericSize <= 15 && numericSize % 2 === 1
  const isOver = game.gameStatus === GameStatus.GAME_OVER
  const targets = selected ? game.board.getValidTargets(selected) : []

  const startGame = () => {
    if (!isValidSize) return
    setGame(new Game(numericSize, boardType))
    setSelected(null)
  }

  const handleCellClick = (coordinate: Coordinate) => {
    if (isOver) return
    if (!selected) {
      if (game.board.getCell(coordinate) === CellState.PEG) setSelected(coordinate)
      return
    }
    if (selected.row === coordinate.row && selected.column === coordinate.column) {
      setSelected(null)
      return
    }
    game.move(selected, coordinate)
    refresh((value) => value + 1)
    setSelected(null)
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#07111f] px-3 py-3 text-white sm:px-5 sm:py-4">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden border border-[#1e3a5f] bg-[#0b1b31] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <GameHeader />

        <section className="grid min-h-0 flex-1 items-center gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(190px,0.7fr)_minmax(380px,1.2fr)_minmax(190px,0.7fr)] lg:gap-8 lg:p-8">
          <GameSetupPanel size={size} boardType={boardType} isValidSize={isValidSize} onSizeChange={setSize} onBoardTypeChange={setBoardType} onStartGame={startGame} />

          <div className="mx-auto flex min-h-0 w-full max-w-[min(60vh,620px)] flex-col items-center justify-center">
            <GameBoard board={game.board} selected={selected} targets={targets} onCellClick={handleCellClick} />
          </div>

          <GameStatePanel game={game} isOver={isOver} hasSelectedPeg={selected !== null} />
        </section>
      </div>
    </main>
  )
}

export default App