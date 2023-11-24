import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Route } from './route';
import { RouteRequest } from './route-request';

@Injectable({providedIn: 'root'})
export class RouteService {
  constructor() { }

  private readonly baseUrl = "http://localhost:8080/api/route";

  private http = inject(HttpClient);

  public getAllRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.baseUrl);
  }

  public addRoute(routeRequest: RouteRequest): Observable<string> {
    console.log(routeRequest);
    return this.http.post(`${this.baseUrl}/new`, routeRequest, { responseType: "text" });
  }

  public updateRoute(routeId: number, start: string, description: string): Observable<string> {
    console.log(start);
    return this.http.put(`${this.baseUrl}/update/${routeId}`, null, {
      params: {
        start: start.replace(" ", "T"),
        description: description
      },
      responseType: "text"
    });
  }

  public deleteRoute(routeId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${routeId}`, { responseType: "text" });
  }
}
