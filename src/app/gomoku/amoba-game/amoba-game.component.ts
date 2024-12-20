import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amoba-game',
  standalone: true,
  imports: [],
  templateUrl: './amoba-game.component.html',
  styleUrl: './amoba-game.component.scss'
})
export class AmobaGameComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  onHomeClicked() {
    this.router.navigateByUrl('gomoku');
  }
}
