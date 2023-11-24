import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from './order';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class OrderService {
  constructor() { }

  private readonly baseUrl = "http://localhost:8080/api/order";

  private http = inject(HttpClient);

  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  public addOrder(order: Order): Observable<string> {
    return this.http.post(`${this.baseUrl}/new`, order, { responseType: "text" });
  }

  public updateOrder(orderId: number, orderNumber: string, description: string): Observable<string> {
    return this.http.put(`${this.baseUrl}/update/${orderId}`, null, {
      params: {
        orderNumber: orderNumber,
        description: description
      },
      responseType: "text"
    });
  }

  public deleteOrder(orderId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${orderId}`, { responseType: "text" });
  }
}
