import { CellState, HexagonBoard, type Board, type Coordinate } from '../game'

interface GameBoardProps {
  board: Board
  selected: Coordinate | null
  targets: Coordinate[]
  onCellClick: (coordinate: Coordinate) => void
}

const sameCoordinate = (first: Coordinate | null, second: Coordinate) =>
  first?.row === second.row && first.column === second.column

export function GameBoard({ board, selected, targets, onCellClick }: GameBoardProps) {
  const grid = board.getGrid()
  const isHexagon = board instanceof HexagonBoard
  return (
    <div
      className="grid aspect-square w-full gap-1 rounded-xl bg-[#061426] p-2 shadow-[0_14px_0_rgba(37,99,235,0.18)] sm:gap-1.5 sm:p-3"
      style={{ gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))` }}
      role="grid"
      aria-label={`${board.size} by ${board.size} peg solitaire board`}
    >
      {grid.map((row, rowIndex) => row.map((state, columnIndex) => {
        const coordinate = { row: rowIndex, column: columnIndex }
        const isTarget = targets.some((target) => sameCoordinate(target, coordinate))
        const isSelected = sameCoordinate(selected, coordinate)
        const isPeg = state === CellState.PEG
        const isEmpty = state === CellState.EMPTY
        return (
          <button
            className={`relative grid aspect-square min-w-0 place-items-center rounded-full border-0 p-0 ${state === CellState.INVALID ? 'invisible' : ''} ${state === CellState.EMPTY ? 'bg-[#29496d]' : ''} ${state === CellState.PEG ? 'bg-[#12345c]' : ''} ${isSelected ? 'outline outline-2 outline-offset-[-4px] outline-white' : ''} ${isTarget ? 'bg-white' : ''}`}
            style={isHexagon ? { transform: `translateX(${(rowIndex - board.center) * 50}%)` } : undefined}
            key={`${rowIndex}-${columnIndex}`}
            type="button"
            disabled={state === CellState.INVALID || (!isPeg && !isTarget)}
            onClick={() => onCellClick(coordinate)}
            aria-label={`${isPeg ? 'Peg' : isEmpty ? 'Empty hole' : 'Invalid'} at row ${rowIndex + 1}, column ${columnIndex + 1}`}
            role="gridcell"
          >
            {isPeg && <span className={`aspect-square h-[68%] rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.3)] ${isSelected ? 'bg-[#60a5fa]' : ''}`} />}
            {isTarget && <span className="aspect-square h-1/4 rounded-full bg-[#2563eb]" />}
          </button>
        )
      }))}
    </div>
  )
}
