import { Routes } from '@angular/router';
import { BarchobaComponent } from './barchoba/barchoba.component';

export const routes: Routes = [
    { path: 'barkochba', component: BarchobaComponent },
    { path: '', redirectTo: '/barkochba', pathMatch: 'full' }
];
