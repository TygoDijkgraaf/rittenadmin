import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Order } from './order';
import { OrderService } from './order.service';

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
export class OrderComponent implements AfterViewInit {
  private orderService: OrderService = inject(OrderService);
  private renderer: Renderer2 = inject(Renderer2);
  private elRef: ElementRef = inject(ElementRef);
  public activeOrder: Order | null = null;

  orders$ = this.orderService.orders$;

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

  public setActiveOrder(order: Order): void {
    this.activeOrder = order;
  }

  public onAddOrder(addForm: NgForm): void {
    document.getElementById("closeOrderForm")?.click();
    this.orders$ = this.orderService.addOrder(addForm.value);
    addForm.reset();
  }

  public onUpdateOrder(editForm: NgForm): void {
    this.orders$ = this.orderService.updateOrder(
      this.activeOrder!.id,
      editForm.value.orderNumber,
      editForm.value.description
    );
  }

  public onDeleteOrder(orderId: number): void {
    this.orders$ = this.orderService.deleteOrder(orderId);
  }
}
