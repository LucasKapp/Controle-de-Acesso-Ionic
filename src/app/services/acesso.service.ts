import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcessoService {

  private apiUrl = 'https://controle-de-acesso-ionic-production.up.railway.app';

  constructor(private http: HttpClient) {}

  registrarAcesso(funcionarioId: string, horario: string, quantidade: number): Observable<any> {
    const token = localStorage.getItem('userToken');  
    const headers = { Authorization: `Bearer ${token}` };

    const acessoData = {
      funcionarioId,
      horario,
      quantidade
    };

    return this.http.post(`${this.apiUrl}/acessos`, acessoData, { headers });
  }

  listarAcessos(): Observable<any[]> {
    const token = localStorage.getItem('userToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/acessos`, { headers });
  }
}
