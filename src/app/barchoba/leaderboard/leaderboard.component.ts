import { Component, OnInit } from '@angular/core';
import { BarchobaService } from '../barchoba.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {

  selectedLanguage: string;
  results: any[] = [];
  competition: string = 'test';

  constructor(private barchobaService: BarchobaService, private router: Router) {
    this.selectedLanguage = this.barchobaService.loadLanguage();
  }

  ngOnInit(): void {
    console.log('initialized');
    this.barchobaService.getResults(this.competition).subscribe({next: resp => {
      console.log(resp);
      this.results = resp;
    }, error: err => {
      console.error(err.error.message);
    }});
  }


  homeButtonClicked() {
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
