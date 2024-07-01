import { Routes } from '@angular/router';
import { BarchobaComponent } from './barchoba/barchoba.component';
import { HostessComponent } from './hostess/hostess.component';

export const routes: Routes = [
    { path: 'barkochba', component: BarchobaComponent },
    { path: 'hostess', component: HostessComponent },
    { path: '', redirectTo: '/barkochba', pathMatch: 'full' }
];
