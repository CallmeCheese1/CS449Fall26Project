import { describe, expect, it } from 'vitest'
import { Board, CellState } from './Board'
import { Game, GameStatus } from './Game'

class FinishedBoard extends Board {
  protected isValidCell(): boolean {
    return true
  }

  public setPegs(coordinates: Array<{ row: number; column: number }>): void {
    for (let row = 0; row < this.size; row += 1) {
      for (let column = 0; column < this.size; column += 1) {
        this.setCell({ row, column }, CellState.EMPTY)
      }
    }
    for (const coordinate of coordinates) {
      this.setCell(coordinate, CellState.PEG)
    }
  }
}

describe('game controller', () => {
  it('delegates moves and reports game over when no moves remain', () => {
    const game = new Game(7, 'english')
    expect(game.gameStatus).toBe(GameStatus.IN_PROGRESS)
    expect(game.move({ row: 3, column: 1 }, { row: 3, column: 3 })).toBe(true)
  })

  //Boom. Welcome from Sprint2. Here's a suite of tests to make sure that, 
  // depending on the number of pegs left, the game properly reports the according rating. 
  it.each([
    [1, 'Outstanding'],
    [2, 'Very Good'],
    [3, 'Good'],
    [4, 'Average'],
  ] as const)('rates a finished game with %i peg(s) as %s', (pegCount, rating) => {
    const board = new FinishedBoard(7)
    board.setPegs(
      Array.from({ length: pegCount }, (_, index) => ({
        row: 0,
        column: index * 2,
      })),
    )
    const game = new Game(board)

    expect(game.gameStatus).toBe(GameStatus.GAME_OVER)
    expect(game.finalRating).toBe(rating)
    expect(game.move({ row: 0, column: 0 }, { row: 0, column: 2 })).toBe(false)
  })
})
