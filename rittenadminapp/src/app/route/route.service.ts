import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, switchMap, EMPTY } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Route } from './route';
import { RouteRequest } from './route-request';

@Injectable({ providedIn: 'root' })
export class RouteService {
  constructor() { }

  private readonly baseUrl = "http://localhost:8080/api/route";

  private http = inject(HttpClient);

  routes$ = this.getAllRoutes();


  public getAllRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  public addRoute(routeRequest: RouteRequest): Observable<Route[]> {
    return this.http.post(`${this.baseUrl}/new`, routeRequest, { responseType: "text" }).pipe(
      tap((response: string) => console.log(response)),
      catchError(this.handleError),
      switchMap(() => this.getAllRoutes())
    );
  }

  public updateRoute(routeId: number, start: string, description: string): Observable<Route[]> {
    return this.http.put(`${this.baseUrl}/update/${routeId}`, null, {
      params: {
        start: start.replace(" ", "T"),
        description: description
      },
      responseType: "text"
    }).pipe(
      tap((response: string) => console.log(response)),
      catchError(this.handleError),
      switchMap(() => this.getAllRoutes())
    );
  }

  public deleteRoute(routeId: number): Observable<Route[]> {
    return this.http.delete(`${this.baseUrl}/delete/${routeId}`, { responseType: "text" }).pipe(
      tap((response: string) => console.log(response)),
      catchError(this.handleError),
      switchMap(() => this.getAllRoutes())
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = JSON.parse(error.error).message;
    alert(errorMessage);
    console.error(errorMessage);
    return EMPTY;
  }
}
