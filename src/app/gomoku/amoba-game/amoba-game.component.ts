import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GomokuService } from '../gomoku.service';
import { GomokuCell } from '../models/gomoku-game.model';

@Component({
  selector: 'app-amoba-game',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './amoba-game.component.html',
  styleUrl: './amoba-game.component.scss'
})
export class AmobaGameComponent {

  board: number[][] = [];
  humanMark: string = 'X';
  machineMark: string = 'O'
  currentPlayer: number = 0;
  winningSequence: GomokuCell[] = [];
  lastMove: GomokuCell[] = [];
  countMoves: number = 0;

  constructor(private router: Router, protected gomokuService: GomokuService) {}

  ngOnInit(): void { 
    this.clearBoard();
    this.loadGame();
  }

  loadGame() {
    const id = this.gomokuService.gameId() ?? localStorage.getItem('gomokuGameId');
    if (!id || id === null) {
      this.gomokuService.gameState.set('standby');
      return;
    }
    this.gomokuService.getGame(id).subscribe({
      next: resp => {
        if (!resp.isActive) {
          this.gomokuService.gameState.set('standby');
          return;
        } 
        this.gomokuService.gameId.set(resp._id);
        this.gomokuService.gameState.set('ongoing');
        this.board = resp.board;
        this.countMoves = resp.counter;
        this.winningSequence = [];
        this.lastMove = [];
        const moveCount = resp.moves?.length || 0;
        if (resp.moves && moveCount > 0) {
          console.log(moveCount, resp.moves[moveCount - 1]);
          this.currentPlayer = resp.moves[moveCount - 1].mark === 1 ? 2 : 1;
        } else {
          this.currentPlayer = 1;
        }
      },
      error: err => {
        console.log(err);
        this.gomokuService.gameState.set('standby');
      }
    })
  }

  initGame() {
    this.clearBoard();
    this.winningSequence = [];
    this.lastMove = [];
    this.countMoves = 0;
    this.currentPlayer = 1;
    this.gomokuService.createGame(this.humanMark, this.machineMark).subscribe({
      next: resp => {
        this.gomokuService.setState('ongoing');
        this.board = resp.board;
        this.gomokuService.gameId.set(resp._id);
        localStorage.setItem('gomokuGameId', resp._id);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onHomeClicked() {
    this.router.navigateByUrl('gomoku');
  }

  onCellClicked(row: number, col: number) {
    if (!this.board[row][col] && this.currentPlayer === 1) {
      this.move(row, col);
    }
  }

  move(row: number, col: number): void {
    this.board[row][col] = 1;
    this.lastMove = [{row, col}];
    this.countMoves++;
    this.currentPlayer = 2;
    this.gomokuService.move(row, col).subscribe({
      next: resp => {
        const { machine, winner, sequence } = resp;
        if (machine) {
          this.board[machine.row][machine.col] = 2;
          this.lastMove.push({ row: machine.row, col: machine.col });
        }
        if (winner) {
          this.winningSequence = sequence!;
          this.currentPlayer = 0;
          this.gomokuService.setState('finished');
          console.log(this.displayCell(winner), 'won the game!');
          this.closeGame();
        } else {
          this.currentPlayer = 1;
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  displayCell(state: number): string {
    if (state === 1) return this.humanMark;
    if (state === 2) return this.machineMark;
    return '';
  }

  isWinningCell(row: number, col: number): boolean {
    return this.winningSequence.some(cell => cell.row === row && cell.col === col);
  }

  isLastMoveCell(row: number, col: number): boolean {
    return this.lastMove.some(cell => cell.row === row && cell.col === col);
  }

  closeGame() {
    this.gomokuService.gameId.set(undefined);
    localStorage.removeItem('gomokuGameId');
  }

  clearBoard() {
    this.board = Array.from({ length: 25 }, () =>
      Array.from({ length: 25 }, () => 0));
    this.lastMove = [];
    this.countMoves = 0;
  }

  homeButtonClicked() {
    this.router.navigateByUrl('gomoku');
  }

  cancelGame() {
    this.clearBoard();
    this.currentPlayer = 0;
    this.gomokuService.setState('finished');
    this.gomokuService.cancelGame().subscribe({
      next: resp => {
        this.closeGame();
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
