import { useState } from 'react'
import { CellState, Game, GameStatus, type BoardType, type Coordinate } from './game'
import { GameBoard } from './components/GameBoard'

const boardOptions: Array<{ value: BoardType; label: string }> = [
  { value: 'english', label: 'English' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'diamond', label: 'Diamond' },
]

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
        <header className="flex shrink-0 items-center justify-center border-b border-[#1e3a5f] px-4 py-3 sm:px-6">
          <h1 className="font-sans text-lg font-bold uppercase tracking-[0.24em] text-white sm:text-xl">Peg Solitaire</h1>
        </header>

        <section className="grid min-h-0 flex-1 items-center gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(190px,0.7fr)_minmax(380px,1.2fr)_minmax(190px,0.7fr)] lg:gap-8 lg:p-8">
          <aside>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#60a5fa]">Game setup</p>
            <p className="mt-2 max-w-sm text-xs leading-5 text-[#93a8c2]">Choose the board and size, then jump pegs into the highlighted holes.</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <label className="text-[10px] font-bold text-[#bfdbfe]">Board size
                <input className="mt-1.5 w-full rounded-md border border-[#28517f] bg-[#102844] px-2.5 py-1.5 text-sm text-white outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/25" type="number" min="7" max="15" step="2" value={size} onChange={(event) => setSize(event.target.value)} />
              </label>
              <label className="text-[10px] font-bold text-[#bfdbfe]">Board type
                <select className="mt-1.5 w-full rounded-md border border-[#28517f] bg-[#102844] px-2.5 py-1.5 text-sm text-white outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/25" value={boardType} onChange={(event) => setBoardType(event.target.value as BoardType)}>
                  {boardOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
            {!isValidSize && <p className="mt-1.5 text-[10px] text-[#fda4af]">Use an odd size from 7 to 15.</p>}
            <button className="mt-3 w-full rounded-md bg-[#2563eb] px-3 py-2 text-left text-xs font-bold text-white transition hover:bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={startGame} disabled={!isValidSize}>Start new game <span className="float-right text-base">↗</span></button>

            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#1e3a5f] pt-4">
              <div><p className="font-mono text-[9px] font-bold text-[#7690ae]">PEGS LEFT</p><p className="mt-0.5 font-display text-3xl font-bold text-white">{game.board.remainingPegs}</p></div>
              <div><p className="font-mono text-[9px] font-bold text-[#7690ae]">BOARD</p><p className="mt-1 font-display text-xl font-bold text-white">{game.board.size} x {game.board.size}</p></div>
              {isOver && <div><p className="font-mono text-[9px] font-bold text-[#7690ae]">RATING</p><p className="mt-1 font-display text-xl font-bold text-[#60a5fa]">{game.finalRating}</p></div>}
            </div>
          </aside>

          <div className="mx-auto flex min-h-0 w-full max-w-[min(60vh,620px)] flex-col items-center justify-center">
            <GameBoard board={game.board} selected={selected} targets={targets} onCellClick={handleCellClick} />
          </div>

          <aside className="border-l border-[#1e3a5f] pl-5 lg:pl-7">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#60a5fa]">{isOver ? 'Game over' : 'In play'}</p>
            <p className="mt-3 text-sm font-semibold text-white">{isOver ? 'No more valid jumps.' : selected ? 'Choose a highlighted hole.' : 'Select a peg to begin.'}</p>
            <p className="mt-2 text-xs leading-5 text-[#93a8c2]">{isOver ? 'Start a new game to play again.' : 'Jump over an adjacent peg into an empty hole.'}</p>
            <div className="mt-5 border-t border-[#1e3a5f] pt-4 font-mono text-[9px] text-[#7690ae]">
              <p>Orthogonal + diagonal jumps</p>
              <p className="mt-1">Center hole starts empty</p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default App
