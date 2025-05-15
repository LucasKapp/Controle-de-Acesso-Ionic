import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://controle-de-acesso-ionic-production.up.railway.app';

  constructor(private http: HttpClient) {}

  register(username: string, id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, id, password });
  }

  login(id: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { id, password });
  }
}
