import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { GomokuGame } from './models/gomoku-game.model';
import { Observable } from 'rxjs';
import { MoveResponseDto } from './models/move-response.model';

@Injectable({
  providedIn: 'root'
})
export class GomokuService {

  baseUrl = environment.backend_url;

  gameId = signal<string | undefined>(undefined);
  
  constructor(private http: HttpClient) { }

  getGame(id: string) {
    const url = `${this.baseUrl}/gomoku/game/${id}`;
    return this.http.get<GomokuGame>(url);
  }
  
  createGame(humanMark: string, machineMark: string): Observable<GomokuGame> {
    const url = `${this.baseUrl}/gomoku/game/new`;
    const payload = { humanMark, machineMark }
    return this.http.post<GomokuGame>(url, payload);
  }

  move(row: number, col: number): Observable<MoveResponseDto> {
    const url = `${this.baseUrl}/gomoku/move`;
    const payload = { gameId: this.gameId(), human: {row, col} }
    return this.http.post<MoveResponseDto>(url, payload);
  }
  
 

}
