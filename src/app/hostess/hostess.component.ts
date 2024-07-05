import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { PopupComponent } from '../shared/popup/popup.component';
import { HostessService } from './hostess.service';
import { hostessTexts } from './hostess.translator';

@Component({
  selector: 'app-hostess',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    PopupComponent,
  ],
  templateUrl: './hostess.component.html',
  styleUrl: './hostess.component.scss'
})
export class HostessComponent {

  selectedLanguage: string = 'en';
  hostedEvent: string = 'Coldplay';
  question: string = '';
  answer: string = '';
  status: string = 'ask';
  showPopup: boolean = false;
  popupMessage: string = '';
  popupType: string = '';
  selInstruction: string = '';
  infoList: {id: string, text: string}[] = [];
  filterInput: string = '';
  filteredInfoList: {id: string, text: string}[] = [];
  questionForm!: FormGroup;
  addForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private hostessService: HostessService) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.questionForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(80)]]
    });
    this.addForm = this.formBuilder.group({
      instruction: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(300)]]
    });
  }


  setLanguage(event: Event) {
    this.selectedLanguage = (event.target as HTMLSelectElement).value;
    console.log(this.selectedLanguage);
  }

  onSubmit() {
    if (this.questionForm.value.question) {
      this.question = this.questionForm.value.question;
      console.log('Question submitted:', this.question);
      this.questionForm.disable();
      this.status = 'sent';
      this.hostessService.sendQuestion(this.question).subscribe({next: response => {
        this.answer = response.answer;
        this.status = 'answered';
        this.questionForm.enable();
      }, error: err => {
        console.log(err);
        this.resetQuestionForm()
      }});
    }
  }

  onNewButtonClicked() {
    this.resetQuestionForm();
  }

  onInputBoxClicked() {
    if (this.status === 'answered') {
      this.resetQuestionForm();
    }
  }

  onAddButtonClicked() {
    this.addForm.reset();
    this.status = 'add';
  }

  onInstructionSubmit() {
    this.status = 'added';
    const instruction = this.addForm.value.instruction;
    console.log(instruction);
    this.hostessService.addInfo(instruction).subscribe({next: resp => {
      console.log('info added with id', resp.id);
      this.addForm.reset();
      this.resetQuestionForm();
    }, error: err => {
      console.log(err);
      this.addForm.reset();
      this.resetQuestionForm();
    }});
  }

  onCancelClicked() {
    this.addForm.reset();
    this.resetQuestionForm();
  }

  onViewButtonClicked() {
    this.status = 'view';
    this.hostessService.loadInfoList().subscribe({next: resp => {
      this.infoList = resp;
      this.filterInput = '';
      this.filteredInfoList = resp;
    }, error: err => {
      console.log(err);
    }})
  }

  onBackButtonClicked() {
    this.resetQuestionForm();
  }

  resetQuestionForm() {
    this.questionForm.reset();
    this.questionForm.enable();
    this.status = 'ask';
  }

  resolvePopup(resp: string) {
    resp === 'yes' ? this.deleteInstruction() : this.hidePopUpMsg();
  }

  hidePopUpMsg() {
    this.showPopup = false;
    this.popupMessage = '';
  }

  onDelIconClicked(item: {id: string, text: string}) {
    this.selInstruction = item.id;
    console.log('delete clicked on', this.selInstruction);
    this.popupMessage = '<strong>' + this.translate('Do you want to delete this instruction') + '?</strong><br><br>' + item.text;
    this.popupType = 'confirm';
    this.showPopup = true;
  }

  deleteInstruction() {
    this.hidePopUpMsg();
    this.hostessService.deleteInfo(this.selInstruction).subscribe({next: resp => {
      console.log('Item deleted:', this.selInstruction);
      this.selInstruction = '';
      this.onViewButtonClicked();
    }, error: err => {
      console.log(err);
    }})
  }

  translate(txt: string): string {
    if (this.selectedLanguage === 'hu') {
       return hostessTexts.find(item => item.en === txt)?.hu || txt;
    }
    return txt;
  }

  filterList() {
    if (this.filterInput) {
      this.filteredInfoList = this.infoList.filter(item => { 
        return item.text.toLowerCase().indexOf(this.filterInput.toLowerCase()) !== -1 
      });
    } else {
      this.filteredInfoList = this.infoList.filter(item => true);
    }
  }

  onEraseIconClicked() {
    this.filterInput = '';
    this.filterList();
  }

}
