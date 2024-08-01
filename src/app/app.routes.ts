import { Routes } from '@angular/router';
import { BarchobaComponent } from './barchoba/barchoba.component';
import { HostessComponent } from './hostess/hostess.component';
import { LeaderboardComponent } from './barchoba/leaderboard/leaderboard.component';

export const routes: Routes = [
    { path: 'barkochba', component: BarchobaComponent, pathMatch: 'full' },
    { path: 'barkochba/leaderboard', component: LeaderboardComponent, pathMatch: 'full' },
    { path: 'hostess', component: HostessComponent },
    { path: '', redirectTo: '/barkochba', pathMatch: 'full' }
];
