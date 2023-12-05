import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, switchMap, shareReplay, share, combineLatest, map } from 'rxjs';
import { Order } from '../order/order';
import { OrderService } from '../order/order.service';
import { Stop } from '../stop/stop';
import { StopComponent } from '../stop/stop.component';
import { StopService } from '../stop/stop.service';
import { Route } from './route';
import { RouteService } from './route.service';

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
export class RouteComponent {
  private routeService: RouteService = inject(RouteService);
  private stopService: StopService = inject(StopService);
  private orderService: OrderService = inject(OrderService);
  public activeRoute: Route | null = null;
  public activeStop: Stop | null = null;

  routes$ = this.routeService.routes$
  orders$ = this.orderService.orders$

  public setActiveRoute(route: Route): void {
    this.activeRoute = route;
  }

  public setActiveStop(stop: Stop): void {
    this.activeStop = stop;
  }

  public onAddRoute(addForm: NgForm): void {
    document.getElementById("closeRouteForm")?.click();
    this.routes$ = this.routeService.addRoute({ ...addForm.value, stops: [] });
    addForm.reset();
  }

  public onUpdateRoute(editForm: NgForm): void {
    this.routes$ = this.routeService.updateRoute(
      this.activeRoute!.id,
      editForm.value.start,
      editForm.value.description
    );
  }

  public onDeleteRoute(routeId: number): void {
    this.routes$ = this.routeService.deleteRoute(routeId);
  }

  public onAddStop(addStopForm: NgForm): void {
    document.getElementById("closeStopForm")?.click();
    this.routes$ = this.stopService.addStop({
      postalCode: addStopForm.value.postalCode,
      houseNumber: addStopForm.value.houseNumber,
      orderId: addStopForm.value.orderId,
      routeId: this.activeRoute!.id
    }).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    );
    addStopForm.reset();
  }

  public onUpdateStop(editStopForm: NgForm): void {
    this.routes$ = this.stopService.updateStop(
      this.activeStop!.id,
      editStopForm.value.postalCode,
      editStopForm.value.houseNumber,
      editStopForm.value.orderId,
      editStopForm.value.routeId
    ).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    );
  }

  public onDeleteStop(stopId: number): void {
    this.routes$ = this.stopService.deleteStop(stopId).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    );
  }

  public onDeliverStop(routes: Observable<Route[]>): void {
    this.routes$ = routes;
  }
}
