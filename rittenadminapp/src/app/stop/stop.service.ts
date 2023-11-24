import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StopRequest } from './stop-request';

@Injectable({providedIn: 'root'})
export class StopService {
  constructor() { }

  private readonly baseUrl = "http://localhost:8080/api/stop";

  private http = inject(HttpClient);

  public addStop(stopRequest: StopRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/new`, stopRequest, { responseType: "text" });
  }

  public updateStop(stopId: number, postalCode: string, houseNumber: string, orderId: number, routeId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/update/${stopId}`, null, {
      params: {
        postalCode: postalCode,
        houseNumber: houseNumber,
        orderId: orderId,
        routeId: routeId
      },
      responseType: "text"
    });
  }

  public deleteStop(stopId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${stopId}`, { responseType: "text" });
  }

  public deliverStop(stopId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/deliver/${stopId}`, null, { responseType: "text" });
  }
}
