import type { Game } from '../game'

interface GameStatePanelProps {
  game: Game
  isOver: boolean
  hasSelectedPeg: boolean
}

export function GameStatePanel({ game, isOver, hasSelectedPeg }: GameStatePanelProps) {
  return (
    <aside className="border-l border-[#1e3a5f] pl-5 lg:pl-7">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#60a5fa]">{isOver ? 'Game over' : 'In play'}</p>
      <p className="mt-3 text-sm font-semibold text-white">{isOver ? 'No more valid jumps.' : hasSelectedPeg ? 'Choose a highlighted hole.' : 'Select a peg to begin.'}</p>
      <p className="mt-2 text-xs leading-5 text-[#93a8c2]">{isOver ? 'Start a new game to play again.' : 'Jump over an adjacent peg into an empty hole.'}</p>
      <div className="mt-5 border-t border-[#1e3a5f] pt-4 font-mono text-[9px] text-[#7690ae]">
        <p>Orthogonal + diagonal jumps</p>
        <p className="mt-1">Center hole starts empty</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#1e3a5f] pt-4">
        <div><p className="font-mono text-[9px] font-bold text-[#7690ae]">PEGS LEFT</p><p className="mt-0.5 font-display text-3xl font-bold text-white">{game.board.remainingPegs}</p></div>
        <div><p className="font-mono text-[9px] font-bold text-[#7690ae]">BOARD</p><p className="mt-1 font-display text-xl font-bold text-white">{game.board.size} x {game.board.size}</p></div>
        {isOver && <div><p className="font-mono text-[9px] font-bold text-[#7690ae]">RATING</p><p className="mt-1 font-display text-xl font-bold text-[#60a5fa]">{game.finalRating}</p></div>}
      </div>
    </aside>
  )
}
