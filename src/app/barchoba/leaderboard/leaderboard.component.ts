import { Component, OnInit } from '@angular/core';
import { BarchobaService } from '../barchoba.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { LeaderboardItem } from '../models/leaderboard-item.model';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent implements OnInit {

  selectedLanguage: string;
  results: LeaderboardItem[] = [];
  competition: string = '';
  ongoing: boolean = false;
  playerName: string = '';
  showSpinner: boolean = false;

  constructor(private barchobaService: BarchobaService, private router: Router) {
    this.selectedLanguage = this.barchobaService.loadLanguage();
  }

  ngOnInit(): void {
    console.log('initialized');
    this.playerName = localStorage.getItem('barchobaPlayer') || '';
    console.log(this.playerName);
    this.getResultList();
  }


  getResultList() {
    this.showSpinner = true;
    this.barchobaService.getResults().subscribe({next: resp => {
      console.log(resp);
      this.competition = resp.competition;
      this.ongoing = resp.ongoing || false;
      const results = resp.results;
      this.results = results;
      this.showSpinner = false;
    }, error: err => {
      console.error(err.error.message);
      this.showSpinner = false;
    }});
  }


  homeButtonClicked() {
    this.barchobaService.setGameID("");
    this.router.navigateByUrl('barkochba');
  }


  setLanguage(event: Event) {
    this.selectedLanguage = (event.target as HTMLSelectElement).value;
    this.barchobaService.setLanguage(this.selectedLanguage);
    console.log(this.barchobaService.getLanguage());
  }


  translate(txt: string): string {
    return this.barchobaService.translator(txt);
  }

}
