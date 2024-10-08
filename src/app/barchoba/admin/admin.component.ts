import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarchobaService } from '../barchoba.service';
import { Competition } from '../models/competition.model';
import { PopupComponent } from '../../shared/popup/popup.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PopupComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  competitions: Competition[] = [];
  isThereOngoing: boolean = false;
  ongoingCompId: string = "";
  showNewCompForm: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = "";
  newCompForm!: FormGroup;

  constructor(private barchobaService: BarchobaService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log('admin initialized');
    this.initForms();
    this.getCompList();
  }

  initForms() {
    this.newCompForm = this.formBuilder.group({
      newCompInput: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  getCompList() {
    this.barchobaService.getCompetitionList().subscribe({
      next: (response) => {
        this.competitions = response;
        let ongoing = "";
        this.competitions.forEach(item => {
          if (item.ongoing) {
            ongoing = item.id;
            this.ongoingCompId = item.id;
          }
        });
        this.isThereOngoing = ongoing.length > 0 ? true : false;
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }


  startCompetition(id: string) {
    this.barchobaService.startCompetition(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getCompList();
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }

  closeBtnClicked(id: string) {
    this.popupMessage = "Do you want to close the ongoing competition?"
    this.showPopup = true;
  }

  closeCompetition(id: string) {
    this.barchobaService.closeCompetition(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getCompList();
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }

  showCompetition(id: string) {
    this.barchobaService.showCompetition(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getCompList();
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }

  hideCompetition(id: string) {
    this.barchobaService.hideCompetition(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getCompList();
      }, 
      error: (err) => {
        console.error(err);
      }
    });
  }

  newCompBtnClicked() {
    this.newCompForm.enable();
    this.newCompForm.reset();
    this.newCompForm.value.newCompInput = "";
    this.showNewCompForm = true;
  }

  newCompSubmitted() {
    console.log(this.newCompForm.value.newCompInput);
    const compName = this.newCompForm.value.newCompInput;
    if (compName) {
      this.barchobaService.createCompetition(compName).subscribe({
        next: (resp) => {
          console.log(resp);
          this.newCompForm.disable();
          this.showNewCompForm = false;
          this.getCompList();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  cancelNewClicked() {
    this.newCompForm.disable();
    this.showNewCompForm = false;
  }

  resolvePopup(resp: string) {
    if (resp === 'yes') this.closeCompetition(this.ongoingCompId);
    this.showPopup = false;
  }



}
