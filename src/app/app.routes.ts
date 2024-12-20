import { Routes } from '@angular/router';
import { BarchobaComponent } from './barchoba/barchoba.component';
import { HostessComponent } from './hostess/hostess.component';
import { LeaderboardComponent } from './barchoba/leaderboard/leaderboard.component';
import { AdminComponent } from './barchoba/admin/admin.component';
import { GomokuComponent } from './gomoku/gomoku.component';
import { AmobaGameComponent } from './gomoku/amoba-game/amoba-game.component';

export const routes: Routes = [
    { path: 'barkochba', component: BarchobaComponent, pathMatch: 'full' },
    { path: 'barkochba/leaderboard', component: LeaderboardComponent, pathMatch: 'full' },
    { path: 'barkochba/admin', component: AdminComponent, pathMatch: 'full' },
    { path: 'hostess', component: HostessComponent },
    { path: 'gomoku', component: GomokuComponent },
    { path: 'gomoku/game', component: AmobaGameComponent },
    { path: 'gomoku/board', component: AmobaGameComponent },
    { path: '', redirectTo: '/barkochba', pathMatch: 'full' }
];
