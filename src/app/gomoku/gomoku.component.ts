import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GomokuService } from './gomoku.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gomoku',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './gomoku.component.html',
  styleUrl: './gomoku.component.scss'
})
export class GomokuComponent implements OnInit {


  constructor(private router: Router, protected gomokuService: GomokuService) {}

  ngOnInit(): void {
    
  }

  onStartClicked() {
    this.router.navigateByUrl('gomoku/game');
  }

}
