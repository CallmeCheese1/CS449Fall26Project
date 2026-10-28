import { Board } from './Board'

//Looks pretty simple, right? Look. The board itself handles all the logic for actually running a board. We define different board types by redefining what counts as a valid cell to only keep cells that match the shape we want.
export class DiamondBoard extends Board {
  protected isValidCell(row: number, column: number): boolean {
    const center = this.center
    return Math.abs(row - center) + Math.abs(column - center) <= center
  }
}
