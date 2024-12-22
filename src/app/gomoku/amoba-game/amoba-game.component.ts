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

  board: string[][] = [];
  humanMark: string = 'X';
  machineMark: string = 'O'
  currentPlayer: string = '';
  winningSequence: GomokuCell[] = [];
  lastMove: GomokuCell[] = [];

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
    this.board[row][col] = this.humanMark;
    this.lastMove = [{row, col}];
    this.currentPlayer = this.machineMark;
    this.gomokuService.move(row, col).subscribe({
      next: resp => {
        const { machine, winner, sequence } = resp;
        console.log(resp);
        if (machine) {
          this.board[machine.row][machine.col] = this.machineMark;
          this.lastMove.push({ row: machine.row, col: machine.col });
        }
        if (winner) {
          console.log(winner, 'won the game');
          this.winningSequence = sequence!;
          this.currentPlayer = '';
          return;
        }
        this.currentPlayer = this.humanMark;
      },
      error: err => {
        console.log(err);
      }
    });
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
