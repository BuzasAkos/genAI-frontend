import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GomokuService {

  constructor(private http: HttpClient) { }

  machineMove(board: string[][], machineMark: string): {row: number, col: number} {
      while (true) {
        const row = Math.floor(Math.random() * 25);
        const col = Math.floor(Math.random() * 25);
        if (!board[row][col]) {
          return {row, col}
        }
      }
  }

  checkWinner(board: string[][]): { winner: string, sequence: {row: number, col: number}[] } {
    const size = board.length;

    // Helper to check if five consecutive cells in a direction match the player
    function getWinningSequence(player: string, row: number, col: number, dRow: number, dCol: number): { row: number, col: number }[] | null {
      const sequence = [];
      for (let i = 0; i < 5; i++) {
        const r = row + i * dRow;
        const c = col + i * dCol;
        if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== player) {
          return null;
        }
        sequence.push({ row: r, col: c });
      }
      return sequence;
    }
  
    // Check every cell on the board
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 'X' || board[row][col] === 'O') {
          const player = board[row][col];
  
          // Check horizontal, vertical, and both diagonals
          const directions = [
            { dRow: 0, dCol: 1 },  // Horizontal
            { dRow: 1, dCol: 0 },  // Vertical
            { dRow: 1, dCol: 1 },  // Diagonal (down-right)
            { dRow: 1, dCol: -1 }  // Diagonal (down-left)
          ];
  
          for (const { dRow, dCol } of directions) {
            const sequence = getWinningSequence(player, row, col, dRow, dCol);
            if (sequence) {
              return { winner: player, sequence };
            }
          }
        }
      }
    }
  
    return { winner: '', sequence: [] }; // No winner
  }

}
