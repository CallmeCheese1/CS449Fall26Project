import { Board } from './Board'

export class EnglishBoard extends Board {
  protected isValidCell(row: number, column: number): boolean {
    const bandWidth = Math.ceil(this.size / 3)
    const centeredRadius = Math.floor((bandWidth - 1) / 2)
    const center = this.center
    return Math.abs(row - center) <= centeredRadius || Math.abs(column - center) <= centeredRadius
  }
}
