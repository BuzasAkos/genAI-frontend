import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amoba-scores',
  standalone: true,
  imports: [],
  templateUrl: './amoba-scores.component.html',
  styleUrl: './amoba-scores.component.scss'
})
export class AmobaScoresComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  onHomeClicked() {
    this.router.navigateByUrl('gomoku');
  }

}
