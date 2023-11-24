import { Component, OnInit, inject, Renderer2, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from './order';
import { OrderService } from './order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, AfterViewInit {
  private orderService: OrderService = inject(OrderService);
  private renderer: Renderer2 = inject(Renderer2);
  private elRef: ElementRef = inject(ElementRef);
  public orders: Order[] = [];
  public activeOrder: Order | null = null;

  ngOnInit(): void {
    this.getOrders();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const orderNumber = params.get("orderNumber");
        const collapsable = this.elRef.nativeElement.querySelector(`#orderDescription${orderNumber}`);
        const heading = this.elRef.nativeElement.querySelector(`#heading${orderNumber}`)
        this.renderer.addClass(collapsable, "show");;
        this.renderer.removeClass(heading, "collapsed");
      }
    }, 500);
  }

  public getOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: Order[]) => {
        this.orders = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public setActiveOrder(order: Order): void {
    this.activeOrder = order;
  }

  public onAddOrder(addForm: NgForm): void {
    document.getElementById("closeOrderForm")?.click();
    this.orderService.addOrder(addForm.value).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getOrders();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
      }
    });
    addForm.reset();
  }

  public onUpdateOrder(editForm: NgForm): void {
    this.orderService.updateOrder(
      this.activeOrder!.id,
      editForm.value.orderNumber,
      editForm.value.description
    ).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getOrders();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
        this.activeOrder = null;
      }
    });
  }

  public onDeleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getOrders();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
        this.activeOrder = null;
      }
    });
  }
}
