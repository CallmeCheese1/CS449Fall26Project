import { describe, expect, it } from 'vitest'
import { Board, CellState, type Coordinate } from './Board'
import { DiamondBoard } from './DiamondBoard'
import { EnglishBoard } from './EnglishBoard'
import { HexagonBoard } from './HexagonBoard'

const centerOf = (size: number): Coordinate => ({
  row: (size - 1) / 2,
  column: (size - 1) / 2,
})

const countCells = (board: Board, state: CellState): number =>
  board.getGrid().flat().filter((cell) => cell === state).length

//NOTE: As described in the User Stories/Acceptance Criteria vs. Tests 
// section of the sprint doc, this is where we run the tests for AC 1.1,
//  2.1, and 3.1. Here, we have a suite of tests where we specify a board
//  type and a board size, create that board, and then check that it has
//  what it should. This unit test suite was written by AI, but this 
// comment is as human as a heart can be.
describe('board initialization', () => {
  it.each([
    [EnglishBoard, 7, 32],
    [EnglishBoard, 11, 56],
    [DiamondBoard, 7, 24],
    [HexagonBoard, 7, 36],
  ])('%s creates the expected cells for size %i', (BoardClass, size, expectedPegs) => {
    const board = new BoardClass(size)
    expect(board.getCell(centerOf(size))).toBe(CellState.EMPTY)
    expect(board.remainingPegs).toBe(expectedPegs)
    expect(countCells(board, CellState.PEG)).toBe(expectedPegs)
    expect(countCells(board, CellState.EMPTY)).toBe(1)
  })

  it.each([6, 8, 16, 7.5, 0])('rejects invalid board size %s', (size) => {
    expect(() => new EnglishBoard(size)).toThrow()
  })
})

describe('board moves', () => {
    //As described in the Sprint2 doc, welcome! This is where 
    // the test for executing a valid jump is. This is just one 
    // test for a valid jump, not a suite. 
  it('executes an orthogonal jump', () => {
    const board = new EnglishBoard(7)
    const from = { row: 3, column: 1 }
    const over = { row: 3, column: 2 }
    const to = { row: 3, column: 3 }

    expect(board.executeMove(from, to)).toBe(true)
    expect(board.getCell(from)).toBe(CellState.EMPTY)
    expect(board.getCell(over)).toBe(CellState.EMPTY)
    expect(board.getCell(to)).toBe(CellState.PEG)
    expect(board.remainingPegs).toBe(31)
  })

  it('executes a diagonal jump', () => {
    const board = new DiamondBoard(11)
    const from = { row: 3, column: 3 }
    const over = { row: 4, column: 4 }
    const to = { row: 5, column: 5 }

    expect(board.executeMove(from, to)).toBe(true)
    expect(board.getCell(from)).toBe(CellState.EMPTY)
    expect(board.getCell(over)).toBe(CellState.EMPTY)
    expect(board.getCell(to)).toBe(CellState.PEG)
  })

  //As described in the Sprint2 document, welcome. This is where things 
  // spice up with a suite of tests to REALLY make sure the board 
  // doesn't let us make invalid moves.
  it.each([
    [{ row: 3, column: 1 }, { row: 3, column: 2 }],
    [{ row: 3, column: 1 }, { row: 3, column: 5 }],
    [{ row: 0, column: 0 }, { row: -2, column: 0 }],
    [{ row: 3, column: 3 }, { row: 3, column: 1 }],
  ])('rejects invalid jump from %j to %j without changing state', (from, to) => {
    const board = new EnglishBoard(7)
    const before = board.getGrid()

    expect(board.executeMove(from, to)).toBe(false)
    expect(board.getGrid()).toEqual(before)
    expect(board.remainingPegs).toBe(32)
  })

  it('reports valid empty targets for a selected peg', () => {
    const board = new EnglishBoard(7)

    expect(board.getValidTargets({ row: 3, column: 1 })).toEqual([
      { row: 3, column: 3 },
    ])
  })
})
