import { Board } from './Board'

export class DiamondBoard extends Board {
  protected isValidCell(row: number, column: number): boolean {
    const center = this.center
    return Math.abs(row - center) + Math.abs(column - center) <= center
  }
}
