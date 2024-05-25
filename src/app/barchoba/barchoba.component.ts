import { Component, OnInit } from '@angular/core';
import { BarchobaService } from './barchoba.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-barchoba',
  templateUrl: './barchoba.component.html',
  styleUrl: './barchoba.component.scss'
})
export class BarchobaComponent implements OnInit {

  @ViewChild('chatHistory') chatHistory!: ElementRef;
  
  chat: {question: string, answer: string}[] = [];
  questionForm!: FormGroup;
  guessForm!: FormGroup;
  answer: string = "";
  status: string = 'not started';
  popupMessage: string = '';
  popupType: string = '';
  showPopup: boolean = false;
  exitMsg: string = '';
  selectedLanguage: string;
  
  constructor(private barchobaService: BarchobaService, private formBuilder: FormBuilder) {
    this.selectedLanguage = this.barchobaService.loadLanguage();
  }

  ngOnInit(): void {
    this.initForms();
    this.loadCurrentGame();
  }

  initForms() {
    this.questionForm = this.formBuilder.group({
      questionInput: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
    });
    this.guessForm = this.formBuilder.group({
      guessInput: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
    }); 
  }

  loadCurrentGame() {
    if (this.barchobaService.checkCurrentGame()) {
      this.status = 'starting';
      this.barchobaService.getChatHistory().subscribe( (resp) => {
        if (!resp) {
          this.status = 'not started';
          this.barchobaService.setGameID('');
          return;
        }
        this.chat = this.barchobaService.buildChat(resp);
        this.answer = '';
        this.status = 'question';
        this.questionForm.reset()
        this.questionForm.enable();
      });
    }
  }

  startGame() {
    this.status = 'starting';
    this.barchobaService.newGame().subscribe( (resp) => {
      this.barchobaService.setGameID(resp.id);
      console.log(resp.id);
      this.answer = '';
      this.chat = [];
      this.status = 'question';
      this.questionForm.reset();
      this.guessForm.reset();
      this.questionForm.enable();
    });
  }

  submitForm() {
    if (this.questionForm.valid) {
      console.log('Form submitted!');
      this.questionForm.disable();
      this.answer = "";
      this.status = "sent";
      let question: string = this.questionForm.value.questionInput;
      if (!question.includes('?', question.length - 3)) {
        question = question + '?';
      }
      this.barchobaService.sendQuestion(question).subscribe( (resp) => {
        const response = resp.content;
        this.chat.unshift({question: question, answer: response});
        console.log(response);
        this.answer = this.translate(response);
        this.status = "answered";
      })
    }
  }

  chatScrollDown() {
    this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
  }

  resetForm() {
    this.questionForm.reset();
    this.status = "question";
    this.answer = "";
    this.questionForm.enable();
  }

  inputClicked() {
    if (this.status === 'answered') {
      this.resetForm();
    }
  }

  loadGuessForm() {
    this.guessForm.reset();
    this.guessForm.enable();
    this.status = "guess";
    this.answer = "";
  }

  submitGuess() {
    if (this.guessForm.valid) {
      console.log('Guess submitted!');
      this.guessForm.disable();
      this.answer = "";
      this.status = "guessed";
      const guess = this.guessForm.value.guessInput;
      this.barchobaService.sendGuess(guess).subscribe( (resp) => {
        const {solution, successful, countQ} = resp;
        console.log(solution, successful, countQ);
        this.status = "completed";
        if (successful) {
          this.answer = `${this.translate('Congrats, you solved it from')} ${countQ} ${this.translate('questions')} !!!` 
        } else {
          this.answer = `${this.translate('The solution was')} ${solution}.`
        }
        this.showPopupInform();
      })
    }
  }

  giveUpGame() {
    this.hidePopUpMsg();
    this.answer = "";
    this.status = 'exited';
    this.barchobaService.sendGuess('').subscribe( (resp) => {
      const {solution, successful, countQ} = resp;
      console.log(solution, successful, countQ);
      this.exitMsg = `${this.translate('You have exited the game')}. \n
      ${this.translate('The solution was')} ${solution}.`;
    });
  }

  exitGame() {
    this.barchobaService.setGameID("");
    this.chat = [];
    this.status = 'not started';
    this.guessForm.reset();
    this.questionForm.reset();
  }

  homeButtonClicked() {
    if (this.status === 'completed' || this.status === 'exited') {
      this.exitGame();
    } else if (this.status === 'answered' || this.status === 'question' || this.status === 'guess') {
      this.showPopupConfirm();
    }
  }

  showPopupConfirm() {
    this.popupMessage = this.translate('Do you really want to exit from this game?')
    this.popupType = 'confirm';
    this.showPopup = true;
  }

  showPopupInform() {
    this.popupMessage = this.answer;
    this.popupType = 'inform';
    this.showPopup = true;
  }

  hidePopUpMsg() {
    this.showPopup = false;
    this.popupMessage = '';
  }

  resolvePopup(resp: string) {
    resp === 'yes' ? this.giveUpGame() : this.hidePopUpMsg();
  }

  translate(txt: string): string {
    return this.barchobaService.translator(txt);
  }

  setLanguage(event: Event) {
    this.selectedLanguage = (event.target as HTMLSelectElement).value;
    this.barchobaService.setLanguage(this.selectedLanguage);
    console.log(this.barchobaService.getLanguage());
  }

}
