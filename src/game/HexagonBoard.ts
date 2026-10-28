import { Board } from './Board'

//see DiamondBoard.ts for explanation
export class HexagonBoard extends Board {
  protected isValidCell(row: number, column: number): boolean {
    const center = this.center
    const rowOffset = row - center
    const columnOffset = column - center
    return (
      Math.abs(rowOffset) <= center &&
      Math.abs(columnOffset) <= center &&
      Math.abs(rowOffset + columnOffset) <= center
    )
  }
}
