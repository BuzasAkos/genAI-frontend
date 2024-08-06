import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { translatedTexts } from './models/translated.texts';
import { Barchoba } from './models/barchoba.model';
import { environment } from '../../environments/environment';
import { Observable, timeout } from 'rxjs';
import { GuessAnswer } from './models/guess-answer.model';
import { LeaderboardItem } from './models/leaderboard-item.model';
import { Message } from './models/message.model';

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
    } else {
      this.language = 'en';
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
    return this.http.get<{
      active: boolean, 
      successful: boolean, 
      solution?: string, 
      chatHistory: {role: string, content: string}[]
    }>(url);
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
    return this.http.post<Barchoba>(url,{}).pipe(timeout(40000));
  }

  sendQuestion(question: string) {
    const url = `${this.baseUrl}/barchoba/ask`;
    return this.http.post<Message>(url, {
      "gameID": this.gameID,
      "question": question
    }).pipe(timeout(25000));
  }

  sendGuess(guess: string) {
    const url = `${this.baseUrl}/barchoba/guess`;
    return this.http.post<GuessAnswer>(url, {
      "gameID": this.gameID,
      "question": guess
    }).pipe(timeout(25000));
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

  getResults(competition: string) {
    const url = `${this.baseUrl}/barchoba/results/${competition}`;
    return this.http.get<LeaderboardItem[]>(url);
  }

  saveResult(player: string, competition: string) {
    const url = `${this.baseUrl}/barchoba/result`;
    const payload = {
      gameID: this.gameID, 
      player: player, 
      competition: competition
    }
    return this.http.patch<{message: string}>(url,payload);
  }

}
