import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HostessService {

  baseUrl = environment.backend_url;
  topic = '667c9722aa7216a3c0785d0f';

  constructor(private httpClient: HttpClient) { }

  

  sendQuestion(question: string): Observable<any> {
    const url = `${this.baseUrl}/hostess/query`;
    const payload = {
      topicID: this.topic,
      question: question
    }
    return this.httpClient.post(url, payload);
  }

  addInfo(info: string): Observable<any> {
    const url = `${this.baseUrl}/hostess/insert`;
    const payload = {
      topicID: this.topic,
      text: info
    }
    return this.httpClient.post(url, payload);
  }


}
