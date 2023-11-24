import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouteService } from './route.service';
import { Route } from './route';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StopComponent } from '../stop/stop.component';
import { Stop } from '../stop/stop';
import { StopService } from '../stop/stop.service';
import { Order } from '../order/order';
import { OrderService } from '../order/order.service';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StopComponent
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export class RouteComponent implements OnInit {
  private routeService: RouteService = inject(RouteService);
  private stopService: StopService = inject(StopService);
  private orderService: OrderService = inject(OrderService);
  public routes: Route[] = [];
  public orders: Order[] = [];
  public activeRoute: Route | null = null;
  public activeStop: Stop | null = null;

  ngOnInit(): void {
    this.getRoutes();
    this.getOrders();
  }

  public getRoutes(): void {
    this.routeService.getAllRoutes().subscribe({
      next: (response: Route[]) => {
        this.routes = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  private getOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: Order[]) => {
        this.orders = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public setActiveRoute(route: Route): void {
    this.activeRoute = route;
  }

  public setActiveStop(stop: Stop): void {
    this.activeStop = stop;
  }

  public onAddRoute(addForm: NgForm): void {
    document.getElementById("closeRouteForm")?.click();
    this.routeService.addRoute({ ...addForm.value, stops: [] }).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getRoutes();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
      }
    });
    addForm.reset();
  }

  public onUpdateRoute(editForm: NgForm): void {
    this.routeService.updateRoute(
      this.activeRoute!.id,
      editForm.value.start,
      editForm.value.description
    ).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getRoutes();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
        this.activeRoute = null;
      }
    });
  }

  public onDeleteRoute(routeId: number): void {
    this.routeService.deleteRoute(routeId).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getRoutes();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
        this.activeRoute = null;
      }
    });
  }

  public onAddStop(addStopForm: NgForm): void {
    document.getElementById("closeStopForm")?.click();
    this.stopService.addStop({
      postalCode: addStopForm.value.postalCode,
      houseNumber: addStopForm.value.houseNumber,
      orderId: addStopForm.value.orderId,
      routeId: this.activeRoute!.id
    }).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getRoutes();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
        this.activeStop = null;
      }
    });
    addStopForm.reset();
  }

  public onUpdateStop(editStopForm: NgForm): void {
    this.stopService.updateStop(
      this.activeStop!.id,
      editStopForm.value.postalCode,
      editStopForm.value.houseNumber,
      editStopForm.value.orderId,
      editStopForm.value.routeId
    ).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getRoutes();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
        this.activeStop = null;
      }
    });
  }

  public onDeleteStop(stopId: number): void {
    this.stopService.deleteStop(stopId).subscribe({
      next: (response: string) => {
        console.log(response);
        this.getRoutes();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
      }
    });
  }
}
