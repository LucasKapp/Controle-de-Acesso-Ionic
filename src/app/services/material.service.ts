import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

registerMaterial(materialName: string, materialDescription: string, materialQuantity: number): Observable<any> {
  const token = localStorage.getItem('userToken');  
  const headers = { Authorization: `Bearer ${token}` };

  const materialData = {
    name: materialName,
    description: materialDescription,
    quantity: materialQuantity
  };

  return this.http.post(`${this.apiUrl}/materials`, materialData, { headers });
}

getMaterials(): Observable<any[]> {
  const token = localStorage.getItem('userToken');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<any[]>(`${this.apiUrl}/materials`, { headers });
}


}
