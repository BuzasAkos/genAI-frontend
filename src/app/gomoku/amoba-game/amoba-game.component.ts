import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  currentPlayer: string = 'X';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard() {
    this.board = Array.from({ length: 25 }, () =>
      Array.from({ length: 25 }, () => '')
    );
  }

  onHomeClicked() {
    this.router.navigateByUrl('gomoku');
  }

  makeMove(row: number, col: number): void {
    // Make a move only if the cell is empty
    if (!this.board[row][col]) {
      this.board[row][col] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; // Switch player
    }
  }
}
