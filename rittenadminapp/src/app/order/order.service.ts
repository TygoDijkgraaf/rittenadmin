import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, of, switchMap, tap } from 'rxjs';
import { Order } from './order';

@Injectable({providedIn: 'root'})
export class OrderService {
  constructor() { }

  private readonly baseUrl = "http://localhost:8080/api/order";

  private http = inject(HttpClient);

  orders$ = this.getAllOrders();

  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  public addOrder(order: Order): Observable<Order[]> {
    return this.http.post(`${this.baseUrl}/new`, order, { responseType: "text" }).pipe(
      tap((response: string) => console.log(response)),
      catchError(this.handleError),
      switchMap(() => this.getAllOrders())
    );
  }

  public updateOrder(orderId: number, orderNumber: string, description: string): Observable<Order[]> {
    return this.http.put(`${this.baseUrl}/update/${orderId}`, null, {
      params: {
        orderNumber: orderNumber,
        description: description
      },
      responseType: "text"
    }).pipe(
      tap((response: string) => console.log(response)),
      catchError(this.handleError),
      switchMap(() => this.getAllOrders())
    );
  }

  public deleteOrder(orderId: number): Observable<Order[]> {
    return this.http.delete(`${this.baseUrl}/delete/${orderId}`, { responseType: "text" }).pipe(
      tap((response: string) => console.log(response)),
      catchError(this.handleError),
      switchMap(() => this.getAllOrders())
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = JSON.parse(error.error).message;
    alert(errorMessage);
    console.error(errorMessage);
    return EMPTY;
  }
}
