export enum CellState {
  INVALID = 'INVALID',
  EMPTY = 'EMPTY',
  PEG = 'PEG',
}

export interface Coordinate {
  row: number
  column: number
}

export interface Move {
  from: Coordinate
  over: Coordinate
  to: Coordinate
}

export abstract class Board {
  public readonly size: number
  protected readonly grid: CellState[][]
  private pegCount: number

  public constructor(size: number) {
    Board.validateSize(size)
    this.size = size
    this.grid = Array.from({ length: size }, () =>
      Array<CellState>(size).fill(CellState.INVALID),
    )
    this.pegCount = 0
    this.generateGrid()
  }

  public static validateSize(size: number): void {
    if (!Number.isInteger(size) || size < 7 || size > 15 || size % 2 === 0) {
      throw new Error('Board size must be an odd integer between 7 and 15.')
    }
  }

  protected abstract isValidCell(row: number, column: number): boolean

  protected generateGrid(): void {
    const center = this.center
    for (let row = 0; row < this.size; row += 1) {
      for (let column = 0; column < this.size; column += 1) {
        if (!this.isValidCell(row, column)) {
          this.grid[row][column] = CellState.INVALID
        } else if (row === center && column === center) {
          this.grid[row][column] = CellState.EMPTY
        } else {
          this.grid[row][column] = CellState.PEG
          this.pegCount += 1
        }
      }
    }
  }

  public get center(): number {
    return (this.size - 1) / 2
  }

  public get remainingPegs(): number {
    return this.pegCount
  }

  public getCell(coordinate: Coordinate): CellState {
    if (!this.isInBounds(coordinate)) {
      return CellState.INVALID
    }
    return this.grid[coordinate.row][coordinate.column]
  }

  public getGrid(): CellState[][] {
    return this.grid.map((row) => [...row])
  }

  //Grab all of our valid targets for a particular coordinate by getting ALL 
  // available moves, then whittling that list down to all the available moves 
  // starting from our FROM and returning only the places our FROM can go TO.
  public getValidTargets(from: Coordinate): Coordinate[] {
    return this.getAvailableMoves()
      .filter((move) => this.sameCoordinate(move.from, from))
      .map((move) => ({ ...move.to }))
  }

  //As the name implies, returns ALL, yes, ALL available moves that we've got by taking every single peg on the board, looking at its potential directions, and then calculating every direction that's jumping over another peg. If it is, put it in our array of valid moves.
  public getAvailableMoves(): Move[] {
    const moves: Move[] = []
    for (let row = 0; row < this.size; row += 1) {
      for (let column = 0; column < this.size; column += 1) {
        const from = { row, column }
        if (this.getCell(from) !== CellState.PEG) {
          continue
        }
        for (const [rowDelta, columnDelta] of Board.directions) {
          const over = { row: row + rowDelta, column: column + columnDelta }
          const to = { row: row + rowDelta * 2, column: column + columnDelta * 2 }
          if (
            this.getCell(over) === CellState.PEG &&
            this.getCell(to) === CellState.EMPTY
          ) {
            moves.push({ from, over, to })
          }
        }
      }
    }
    return moves
  }

  //Do the thing. Check to make sure we're moving to a valid place, 
  // put together a move, check if it's in our total available moves, and 
  // if so, destroy me, destroy who i'm jumping over, and make a new 
  // peg at the coordinate. Returns true if the move works, false if not valid.
  public executeMove(from: Coordinate, to: Coordinate): boolean {
    if (!this.isCoordinate(from) || !this.isCoordinate(to)) {
      return false
    }
    const rowDelta = to.row - from.row
    const columnDelta = to.column - from.column
    if (
      !(
        (Math.abs(rowDelta) === 2 && columnDelta === 0) ||
        (rowDelta === 0 && Math.abs(columnDelta) === 2) ||
        (Math.abs(rowDelta) === 2 && Math.abs(columnDelta) === 2)
      )
    ) {
      return false
    }

    const move = {
      from,
      over: {
        row: from.row + rowDelta / 2,
        column: from.column + columnDelta / 2,
      },
      to,
    }
    if (!this.getAvailableMoves().some((candidate) => this.sameMove(candidate, move))) {
      return false
    }

    this.grid[from.row][from.column] = CellState.EMPTY
    this.grid[move.over.row][move.over.column] = CellState.EMPTY
    this.grid[to.row][to.column] = CellState.PEG
    this.pegCount -= 1
    return true
  }

  //Not used in any actual gameplay. Unit tests will call this function 
  // in the process to set up new boards to automatically test game states.
  protected setCell(coordinate: Coordinate, state: CellState): void {
    if (!this.isInBounds(coordinate)) {
      throw new Error('Cannot set a cell outside the board.')
    }
    const previous = this.grid[coordinate.row][coordinate.column]
    if (previous === state) {
      return
    }
    if (previous === CellState.PEG) {
      this.pegCount -= 1
    }
    if (state === CellState.PEG) {
      this.pegCount += 1
    }
    this.grid[coordinate.row][coordinate.column] = state
  }

  private isInBounds(coordinate: Coordinate): boolean {
    return (
      this.isCoordinate(coordinate) &&
      coordinate.row >= 0 &&
      coordinate.row < this.size &&
      coordinate.column >= 0 &&
      coordinate.column < this.size
    )
  }

  private isCoordinate(coordinate: Coordinate): boolean {
    return Number.isInteger(coordinate.row) && Number.isInteger(coordinate.column)
  }

  private sameCoordinate(first: Coordinate, second: Coordinate): boolean {
    return first.row === second.row && first.column === second.column
  }

  private sameMove(first: Move, second: Move): boolean {
    return (
      this.sameCoordinate(first.from, second.from) &&
      this.sameCoordinate(first.to, second.to)
    )
  }

  private static readonly directions: ReadonlyArray<readonly [number, number]> = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]
}
