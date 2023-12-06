import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, Subject, of, startWith, switchMap } from 'rxjs';
import { Order } from './order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  private orderService: OrderService = inject(OrderService);
  activeOrder: Order | null = null;

  addForm!: FormGroup;
  editForm!: FormGroup;

  actionSubject = new Subject<{ action: string, data?: any }>();
  action$ = this.actionSubject.asObservable();

  orders$ = this.action$.pipe(
    startWith(this.orderService.getAllOrders()),
    switchMap(action => {
      if (action instanceof Observable) return action;
      switch (action.action) {
        case 'addOrder':
          return this.onAddOrder();
        case 'updateOrder':
          return this.onUpdateOrder();
        case 'deleteOrder':
          return this.onDeleteOrder(action.data);
        default:
          return of(null);
      }
    })
  );

  ngOnInit(): void {
    this.addForm = new FormGroup({
      orderNumber: new FormControl('', [Validators.required,
                                        Validators.minLength(3),
                                        Validators.maxLength(20)]),
      description: new FormControl('')
    });

    this.editForm = new FormGroup({
      orderNumber: new FormControl('', [Validators.required,
                                        Validators.minLength(3),
                                        Validators.maxLength(20)]),
      description: new FormControl('')
    });
  }

  public setActiveOrder(order: Order): void {
    this.activeOrder = order;
    this.editForm.setValue({
      orderNumber: this.activeOrder.orderNumber,
      description: this.activeOrder.description
    });
  }

  public onAddOrder(): Observable<Order[]> {
    document.getElementById("closeOrderForm")?.click();
    const result$ = this.orderService.addOrder(this.addForm.value);
    this.addForm.reset();
    return result$;
  }

  public onUpdateOrder(): Observable<Order[]> {
    return this.orderService.updateOrder(
      this.activeOrder!.id,
      this.editForm.value.orderNumber,
      this.editForm.value.description
    );
  }

  public onDeleteOrder(orderId: number): Observable<Order[]> {
    return this.orderService.deleteOrder(orderId);
  }
}
