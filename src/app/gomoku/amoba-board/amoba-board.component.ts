import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amoba-board',
  standalone: true,
  imports: [],
  templateUrl: './amoba-board.component.html',
  styleUrl: './amoba-board.component.scss'
})
export class AmobaBoardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  onHomeClicked() {
    this.router.navigateByUrl('gomoku');
  }

}
