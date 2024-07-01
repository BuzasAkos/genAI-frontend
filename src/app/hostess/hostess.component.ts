import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { HostessService } from './hostess.service';

@Component({
  selector: 'app-hostess',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './hostess.component.html',
  styleUrl: './hostess.component.scss'
})
export class HostessComponent {

  selectedLanguage: string = 'en';
  hostedEvent: string = 'Coldplay concert';
  question: string = '';
  answer: string = '';
  status: string = 'ask';
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
    // this.status = 'view';
  }

  resetQuestionForm() {
    this.questionForm.reset();
    this.questionForm.enable();
    this.status = 'ask';
  }

}
