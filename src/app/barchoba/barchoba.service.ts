import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { translatedTexts } from './models/translated.texts';

@Injectable({
  providedIn: 'root'
})
export class BarchobaService {

  //baseUrl = "http://localhost:3000";
  baseUrl = "https://nestjs-akosbuzas-4c8e7884e659.herokuapp.com"
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
    if (lang in ['en', 'hu']) {
      this.language = lang;
      localStorage.setItem('barchobaLanguage', lang);
    }
  }

  loadLanguage() {
    const lang = localStorage.getItem('barchobaLanguage');
    if (lang) {
      lang in ['en', 'hu'] ? this.language = lang : this.language = 'en';
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
      console.log(id);
      return true;
    }
    return false;
  }

  getChatHistory() {
    const url = `${this.baseUrl}/barchoba/${this.gameID}`;
    return this.http.get<any>(url);
  }

  newGame() {
    const url = `${this.baseUrl}/barchoba/new`;
    return this.http.post<any>(url,{});
  }

  sendQuestion(question: string) {
    const url = `${this.baseUrl}/barchoba/ask`;
    return this.http.post<any>(url, {
      "gameID": this.gameID,
      "question": question
    });
  }

  sendGuess(guess: string) {
    const url = `${this.baseUrl}/barchoba/guess`;
    return this.http.post<any>(url, {
      "gameID": this.gameID,
      "question": guess
    });
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
