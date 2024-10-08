import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarchobaComponent } from './barchoba.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from '../shared/popup/popup.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { DurationPipe } from './pipes/duration.pipe';


@NgModule({
  declarations: [
    BarchobaComponent,
    LeaderboardComponent,
    DurationPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SpinnerComponent,
    PopupComponent,
  ]
})
export class BarchobaModule { }
