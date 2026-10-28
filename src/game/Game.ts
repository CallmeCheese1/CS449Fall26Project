import { Board, type Coordinate } from './Board'
import { DiamondBoard } from './DiamondBoard'
import { EnglishBoard } from './EnglishBoard'
import { HexagonBoard } from './HexagonBoard'

export type BoardType = 'english' | 'hexagon' | 'diamond'

export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  GAME_OVER = 'GAME_OVER',
}

export type Rating = 'Outstanding' | 'Very Good' | 'Good' | 'Average'

export class Game {
  public readonly board: Board
  private status: GameStatus
  private rating: Rating | null

  //This constructor looks a little weird, right? Basically, define a game by either naming a size and a boardtype, OR by passing an already-created board object.
  public constructor(sizeOrBoard: number | Board, boardType: BoardType = 'english') {
    //if it's not a number, it's a board object
    this.board =
      typeof sizeOrBoard === 'number'
        ? Game.createBoard(sizeOrBoard, boardType)
        : sizeOrBoard
    this.status = GameStatus.IN_PROGRESS
    this.rating = null
    this.updateStatus()
  }

  public get gameStatus(): GameStatus {
    return this.status
  }

  public get finalRating(): Rating | null {
    return this.rating
  }

  public move(from: Coordinate, to: Coordinate): boolean {
    if (this.status === GameStatus.GAME_OVER) {
      return false
    }
    const moved = this.board.executeMove(from, to)
    if (moved) {
      this.updateStatus()
    }
    return moved
  }

  private updateStatus(): void {
    if (this.board.getAvailableMoves().length === 0) {
      this.status = GameStatus.GAME_OVER
      this.rating = Game.ratingFor(this.board.remainingPegs)
    }
  }

  private static createBoard(size: number, boardType: BoardType): Board {
    switch (boardType) {
      case 'english':
        return new EnglishBoard(size)
      case 'hexagon':
        return new HexagonBoard(size)
      case 'diamond':
        return new DiamondBoard(size)
      default:
        throw new Error(`Unknown board type: ${boardType}`)
    }
  }

  private static ratingFor(remainingPegs: number): Rating {
    switch (remainingPegs) {
      case 1:
        return 'Outstanding'
      case 2:
        return 'Very Good'
      case 3:
        return 'Good'
      default:
        return 'Average'
    }
  }
}
