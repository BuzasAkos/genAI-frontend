import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GomokuService } from '../gomoku.service';

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

  board: string[][] = [];
  humanMark: string = 'X';
  machineMark: string = 'O'
  currentPlayer: string = '';
  winningSequence: {row: number, col: number}[] = [];
  lastMove: {row: number, col: number}[] = [];

  constructor(private router: Router, private gomokuService: GomokuService) {}

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
    this.winningSequence = [];
    this.lastMove = [];
    this.currentPlayer = this.humanMark;
    this.gomokuService.createGame(this.humanMark, this.machineMark).subscribe({
      next: resp => {
        this.board = resp.board;
        this.gomokuService.gameId.set(resp._id);
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
    if (!this.board[row][col] && this.humanMark === this.currentPlayer) {
      this.move(row, col);
    }
  }

  move(row: number, col: number): void {
    if (!this.board[row][col]) {
      this.board[row][col] = this.currentPlayer;
      this.lastMove.push({ row, col });
      if (this.lastMove.length > 2) this.lastMove.shift();

      const result = this.gomokuService.checkWinner(this.board);
      if (result.winner) {
        this.winningSequence = result.sequence;
        this.closeGame(result.winner);
        return;
      }

      this.currentPlayer = this.currentPlayer === this.humanMark ? this.machineMark : this.humanMark;
      if (this.currentPlayer === this.machineMark) {
        this.invokeMachine();
      }
    }
  }

  invokeMachine() {
    const { row, col } = this.gomokuService.machineRndMove(this.board, this.machineMark);
    this.move(row, col);
  }

  isWinningCell(row: number, col: number): boolean {
    return this.winningSequence.some(cell => cell.row === row && cell.col === col);
  }

  isLastMoveCell(row: number, col: number): boolean {
    return this.lastMove.some(cell => cell.row === row && cell.col === col);
  }

  closeGame(winner: string) {
    console.log(winner, 'won!', this.winningSequence);
    this.currentPlayer = '';
  }

}
