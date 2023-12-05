import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, catchError, tap } from 'rxjs';
import { StopRequest } from './stop-request';

@Injectable({providedIn: 'root'})
export class StopService {
  constructor() { }

  private readonly baseUrl = "http://localhost:8080/api/stop";

  private http = inject(HttpClient);

  public addStop(stopRequest: StopRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/new`, stopRequest, { responseType: "text" }).pipe(
      tap(response => console.log(response)),
      catchError(this.handleError)
    );
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
    }).pipe(
      tap(response => console.log(response)),
      catchError(this.handleError)
    );
  }

  public deleteStop(stopId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${stopId}`, { responseType: "text" }).pipe(
      tap(response => console.log(response)),
      catchError(this.handleError)
    );
  }

  public deliverStop(stopId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/deliver/${stopId}`, null, { responseType: "text" }).pipe(
      tap(response => console.log(response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = JSON.parse(error.error).message;
    alert(errorMessage);
    console.error(errorMessage);
    return EMPTY;
  }
}
