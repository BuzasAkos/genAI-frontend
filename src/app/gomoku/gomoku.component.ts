import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gomoku',
  standalone: true,
  imports: [],
  templateUrl: './gomoku.component.html',
  styleUrl: './gomoku.component.scss'
})
export class GomokuComponent implements OnInit {


  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  onStartClicked() {
    this.router.navigateByUrl('gomoku/game');
  }

}
