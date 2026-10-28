import type { BoardType } from '../game'

interface GameSetupPanelProps {
  size: string
  boardType: BoardType
  isValidSize: boolean
  onSizeChange: (size: string) => void
  onBoardTypeChange: (boardType: BoardType) => void
  onStartGame: () => void
}

const boardOptions: Array<{ value: BoardType; label: string }> = [
  { value: 'english', label: 'English' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'diamond', label: 'Diamond' },
]

export function GameSetupPanel({
  size,
  boardType,
  isValidSize,
  onSizeChange,
  onBoardTypeChange,
  onStartGame,
}: GameSetupPanelProps) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#60a5fa]">Game setup</p>
      <p className="mt-2 max-w-sm text-xs leading-5 text-[#93a8c2]">Choose the board and size, then jump pegs into the highlighted holes.</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="text-[10px] font-bold text-[#bfdbfe]">Board size
          <input className="mt-1.5 w-full rounded-md border border-[#28517f] bg-[#102844] px-2.5 py-1.5 text-sm text-white outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/25" type="number" min="7" max="15" step="2" value={size} onChange={(event) => onSizeChange(event.target.value)} />
        </label>
        <label className="text-[10px] font-bold text-[#bfdbfe]">Board type
          <select className="mt-1.5 w-full rounded-md border border-[#28517f] bg-[#102844] px-2.5 py-1.5 text-sm text-white outline-none focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/25" value={boardType} onChange={(event) => onBoardTypeChange(event.target.value as BoardType)}>
            {boardOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      {!isValidSize && <p className="mt-1.5 text-[10px] text-[#fda4af]">Use an odd size from 7 to 15.</p>}
      <button className="mt-3 w-full rounded-md bg-[#2563eb] px-3 py-2 text-left text-xs font-bold text-white transition hover:bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={onStartGame} disabled={!isValidSize}>
        Start new game <span className="float-right text-base">↗</span>
      </button>
    </div>
  )
}
