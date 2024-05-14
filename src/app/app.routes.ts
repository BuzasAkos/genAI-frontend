import { Routes } from '@angular/router';
import { BarchobaComponent } from './barchoba/barchoba.component';

export const routes: Routes = [
    { path: 'barchoba', component: BarchobaComponent },
    { path: '', redirectTo: '/barchoba', pathMatch: 'full' }
];
