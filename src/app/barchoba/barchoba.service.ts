import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { translatedTexts } from './models/translated.texts';
import { environment } from '../../environments/environment';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarchobaService {

  baseUrl = environment.backend_url;
  messages: {role: string, content: string}[] = []; 
  private gameID: string = "";
  private language: string = "hu";

  constructor(private http: HttpClient) { }

  setGameID(id: string) {
    this.gameID = id;
    if (id) {
      localStorage.setItem('barchobaGameID', id);
    } else if (localStorage.getItem('barchobaGameID')) {
      localStorage.removeItem('barchobaGameID');
    }
  }

  setLanguage(lang: string) {
    if (['en', 'hu'].includes(lang)) {
      this.language = lang;
      localStorage.setItem('barchobaLanguage', lang);
    }
  }

  loadLanguage() {
    const lang = localStorage.getItem('barchobaLanguage');
    if (lang) {
      ['en', 'hu'].includes(lang) ? this.language = lang : this.language = 'en';
    }
    return this.language;
  }

  getLanguage() {
    return this.language;
  }

  checkCurrentGame(): boolean {
    const id = localStorage.getItem('barchobaGameID');
    if (id) {
      this.gameID = id;
      console.log('loading game:', id);
      return true;
    }
    return false;
  }

  getChatHistory() {
    const url = `${this.baseUrl}/barchoba/${this.gameID}`;
    return this.http.get<any>(url);
  }

  buildChat(msg: {role: string, content: string}[]) {
    const chatBuilt: {question: string, answer: string}[] = [];
    let question: string;
    let answer: string;
    msg.forEach( (item) => {
      if (item.role === 'user') {
        question = item.content;
      }
      if (item.role === 'assistant') {
        answer = item.content;
        chatBuilt.unshift({question, answer});
      }
    });
    return chatBuilt;
  }

  newGame() {
    const url = `${this.baseUrl}/barchoba/new`;
    return this.http.post<any>(url,{}).pipe(timeout(30000));
  }

  sendQuestion(question: string) {
    const url = `${this.baseUrl}/barchoba/ask`;
    return this.http.post<any>(url, {
      "gameID": this.gameID,
      "question": question
    }).pipe(timeout(20000));
  }

  sendGuess(guess: string) {
    const url = `${this.baseUrl}/barchoba/guess`;
    return this.http.post<any>(url, {
      "gameID": this.gameID,
      "question": guess
    }).pipe(timeout(20000));
  }

  translator(txt: string) {
    if (this.language === 'en') {
      return txt;
    }
    if (this.language === 'hu') {
      const trText = translatedTexts.find( item => item.en === txt);
      return trText ? trText.hu : txt;
    }
    return txt;
  }

}
