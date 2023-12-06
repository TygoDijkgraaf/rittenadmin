import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, Subject, Subscription, of, startWith, switchMap } from 'rxjs';
import { Order } from './order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy {
  private orderService: OrderService = inject(OrderService);
  activeOrder: Order | null = null;

  addForm!: FormGroup;
  editForm!: FormGroup;

  orderNumberErrorMessage = '';
  private validationMessages: { [key: string]: string } = {
    required: 'Please enter an order number',
    minlength: 'Order number is too short',
    maxlength: 'Order number is too long'
  };

  private subs: Subscription[] = [];

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

    const orderNumberControlAdd = this.addForm.get('orderNumber');
    this.subs.push(orderNumberControlAdd!.valueChanges.subscribe(
      () => this.setMessage(orderNumberControlAdd!)
    ));

    const orderNumberControlEdit = this.editForm.get('orderNumber');
    this.subs.push(orderNumberControlEdit!.valueChanges.subscribe(
      () => this.setMessage(orderNumberControlEdit!)
    ));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private setMessage(c: AbstractControl): void {
    this.orderNumberErrorMessage = '';
    if (c.dirty && c.errors) {
      this.orderNumberErrorMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]
      ).join(' ');
    }
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
