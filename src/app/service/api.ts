import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private urlApi = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  public getData(pagina: number = 1): Observable<any> {
    const url = `${this.urlApi}?page=${pagina}`;
    return this.http.get<any>(url);
  } 
}
