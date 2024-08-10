import { Component, OnInit } from '@angular/core';
import { BarchobaService } from './barchoba.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { PopupComponent } from '../shared/popup/popup.component';

@Component({
  selector: 'app-barchoba',
  templateUrl: './barchoba.component.html',
  styleUrl: './barchoba.component.scss',
})
export class BarchobaComponent implements OnInit {

  @ViewChild('chatHistory') chatHistory!: ElementRef;
  
  chat: {question: string, answer: string}[] = [];
  questionForm!: FormGroup;
  guessForm!: FormGroup;
  answer: string = "";
  solution: string = "";
  status: string = 'not started';
  popupMessage: string = '';
  popupType: string = '';
  showPopup: boolean = false;
  exitMsg: string = '';
  selectedLanguage: string;
  playerName: string = '';
  competition: string = '';
  successful: boolean = false;
  resultSubmitted: boolean = false;
  
  constructor(private barchobaService: BarchobaService, private formBuilder: FormBuilder, private router: Router) {
    this.selectedLanguage = this.barchobaService.loadLanguage();
  }

  ngOnInit(): void {
    this.initForms();
    this.loadCurrentGame();
  }

  initForms() {
    this.questionForm = this.formBuilder.group({
      questionInput: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
    });
    this.guessForm = this.formBuilder.group({
      guessInput: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]]
    }); 
  }

  loadCurrentGame() {
    if (this.barchobaService.checkCurrentGame()) {
      this.status = 'starting';
      this.barchobaService.getChatHistory().subscribe({next: (resp) => {
        if (!resp) {
          this.exitGame();
          return;
        }
        this.chat = this.barchobaService.buildChat(resp.chatHistory);
        this.answer = '';
        if (resp.active) {
          this.status = 'question';
          this.answer = '';
          this.questionForm.reset()
          this.questionForm.enable();
          return;
        } 
        if (resp.successful) {
          this.status = 'completed';
          this.successful = true;
          this.solution = resp.solution || '';
          this.guessForm.disable();
          const countQ = this.chat.length;
          this.answer = `${this.translate('Congrats, you solved it from')} ${countQ} ${this.translate('questions')} !!!`
          return;
        } 
        this.exitGame();
        return;
      
      }, error: (err) => {
        console.log(err);
        this.exitGame();
      }});
    }
  }

  startGame() {
    this.status = 'starting';
    this.barchobaService.newGame().subscribe({next: (resp) => {
      this.barchobaService.setGameID(resp.id);
      console.log(resp.id);
      this.answer = '';
      this.solution = '';
      this.competition = '';
      this.successful = false;
      this.resultSubmitted = false;
      this.chat = [];
      this.status = 'question';
      this.questionForm.reset();
      this.guessForm.reset();
      this.questionForm.enable();
    }, error: (err) => {
      console.log(err);
      this.status = 'not started';
    }});
  }

  submitForm() {
    if (this.questionForm.valid) {
      this.questionForm.disable();
      this.answer = "";
      this.status = "sent";
      let question: string = this.questionForm.value.questionInput;
      if (!question.includes('?', question.length - 3)) {
        question = question + '?';
      }
      console.log('Question submitted:', question);
      this.barchobaService.sendQuestion(question).subscribe({next: (resp) => {
        const response = resp.content;
        this.chat.unshift({question: question, answer: response});
        console.log(response);
        this.answer = this.translate(response);
        this.status = "answered";
        this.questionForm.enable();
      }, error: (err) => {
        console.log(err);
        this.resetForm();
        if (err.name && err.name === 'TimeoutError') {
          alert(this.translate("The model is not responding. Proceed with another question."));
        }
        if (err.error && err.error.message) {
          alert(this.translate(err.error.message));
        }
      }})
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
      this.barchobaService.sendGuess(guess).subscribe({next: (resp) => {
        const {solution, successful, countQ, competition} = resp;
        console.log(solution, successful, countQ, competition);
        this.solution = solution;
        this.competition = competition || '';
        this.successful = successful || false;
        this.status = "completed";

        if (successful) {
          this.answer = `${this.translate('Congrats, you solved it from')} ${countQ} ${this.translate('questions')} !!!`
          competition ? this.showPopupInstruct(): this.showPopupInform();
        } else {
          this.answer = `${this.translate('Sorry, your guess was not correct')}.`
          this.showPopupInform();
        }
        
      }, error: (err) => {
        console.log(err);
        if (err.name && err.name === 'TimeoutError') {
          console.log(err.name);
          alert(this.translate("The model is not responding. Please, try again."));
        }
        if (err.error && err.error.message) {
          console.log(err.error.message);
          alert(this.translate(err.error.message));
        }
        this.loadGuessForm();
      }})
    }
  }

  giveUpGame() {
    this.hidePopUpMsg();
    this.answer = "";
    this.status = 'exited';
    this.successful = false;
    this.barchobaService.sendGuess('exit').subscribe({next: (resp) => {
      const {solution, successful, countQ} = resp;
      console.log(solution, successful, countQ);
      this.exitMsg = `${this.translate('You have exited the game')}. \n
      ${this.translate('The solution was')} ${solution}.`;
    }, error: (err) => {
      console.log(err);
      alert(this.translate("The model is not responding. Please, try again."));
      this.resetForm();
    }});
  }

  exitGame() {
    this.barchobaService.setGameID("");
    this.chat = [];
    this.status = 'not started';
    this.solution = '';
    this.competition = '';
    this.successful = false;
    this.resultSubmitted = false;
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
    this.popupMessage = `${this.answer} <br>The solution was <strong>${this.solution}</strong>`;
    this.popupType = 'inform';
    this.showPopup = true;
  }

  showPopupInstruct() {
    if (this.selectedLanguage === 'hu') {
      this.popupMessage = `${this.answer} <br><br>` +
      `Kérlek, írd be a <strong>(bece)neved</strong>, hogy közzétegyük az eredményed a <strong>${this.competition}</strong> eredménytábláján. 
        <br><br> Nyomj cancelt, ha nem szeretnéd megosztani az eredményedet.`
    } else {
      this.popupMessage = `${this.answer} <br><br>` +
      `Please, enter <strong>your (nick)name</strong> to post your result to the leaderboard of <strong>${this.competition}</strong>.
        <br><br> Press cancel if you do not wish to share your result.` 
    }
    this.popupType = 'instruct';
    this.playerName = localStorage.getItem('barchobaPlayer') || '';
    this.showPopup = true;
  }

  hidePopUpMsg() {
    this.showPopup = false;
    this.popupMessage = '';
  }

  resolvePopup(resp: string) {
    resp === 'yes' ? this.giveUpGame() : this.hidePopUpMsg();
  }

  submitPlayer(userInput: string) {
    this.status = "guessed";
    this.playerName = userInput;
    localStorage.setItem('barchobaPlayer', this.playerName);
    console.log(this.playerName);
    this.barchobaService.saveResult(this.playerName, this.competition).subscribe({
      next: (resp) => {
        console.log(resp.message);
        this.resultSubmitted = true;
        this.hidePopUpMsg();
        this.status = "completed";
      }, 
      error: (err) => {
        console.error(err);
        this.hidePopUpMsg();
        this.status = "completed";
      }
    });
    
  }

  translate(txt: string): string {
    return this.barchobaService.translator(txt);
  }

  setLanguage(event: Event) {
    this.selectedLanguage = (event.target as HTMLSelectElement).value;
    this.barchobaService.setLanguage(this.selectedLanguage);
    console.log(this.barchobaService.getLanguage());
  }

  showBoard() {
    this.router.navigateByUrl('barkochba/leaderboard');
  }

}
