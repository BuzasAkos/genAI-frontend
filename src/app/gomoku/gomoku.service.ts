import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { GomokuGame } from './models/gomoku-game.model';
import { Observable } from 'rxjs';
import { MoveResponseDto } from './models/move-response.model';

@Injectable({
  providedIn: 'root'
})
export class GomokuService {

  baseUrl = environment.backend_url;

  gameId = signal<string | undefined>(undefined);
  
  constructor(private http: HttpClient) { }

  
  createGame(humanMark: string, machineMark: string): Observable<GomokuGame> {
    const url = `${this.baseUrl}/gomoku/game/new`;
    const payload = { humanMark, machineMark }
    return this.http.post<GomokuGame>(url, payload);
  }

  move(row: number, col: number): Observable<MoveResponseDto> {
    const url = `${this.baseUrl}/gomoku/move`;
    const payload = { gameId: this.gameId(), human: {row, col} }
    return this.http.post<MoveResponseDto>(url, payload);
  }
  
  /*
  machineRndMove(board: string[][], machineMark: string): {row: number, col: number} {
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
  
    return { winner: '', sequence: [] }; // No winner yet
  }
  */

}
