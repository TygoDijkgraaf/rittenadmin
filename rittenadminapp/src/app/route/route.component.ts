import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { merge, Observable, of, startWith, Subject, switchMap } from 'rxjs';
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
    ReactiveFormsModule,
    RouterLink,
    StopComponent
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export class RouteComponent implements OnInit {
  private routeService: RouteService = inject(RouteService);
  private stopService: StopService = inject(StopService);
  private orderService: OrderService = inject(OrderService);
  public activeRoute: Route | null = null;
  public activeStop: Stop | null = null;

  addForm!: FormGroup;
  editForm!: FormGroup;
  addStopForm!: FormGroup;
  editStopForm!: FormGroup;

  routeActionSubject = new Subject<{ action: string, data?: any }>();
  stopActionSubject = new Subject<{ action: string, data?: any }>();
  routeAction$ = this.routeActionSubject.asObservable();
  stopAction$ = this.stopActionSubject.asObservable();

  action$ = merge(
    this.routeAction$,
    this.stopAction$
  );

  orders$ = this.orderService.orders$
  routes$ = this.action$.pipe(
    startWith({action: 'none', data: this.routeService.getAllRoutes()}),
    switchMap(action => {
      if (action.action === 'none') return action.data as Observable<Route[]>;
      switch (action.action) {
        case 'addRoute':
          return this.onAddRoute();
        case 'updateRoute':
          return this.onUpdateRoute();
        case 'deleteRoute':
          return this.onDeleteRoute(action.data);
        case 'addStop':
          return this.onAddStop();
        case 'updateStop':
          return this.onUpdateStop();
        case 'deleteStop':
          return this.onDeleteStop(action.data);
        case 'deliverStop':
          return action.data as Observable<Route[]>;
        default:
          return of(null);
      }
    })
  );

  ngOnInit(): void {
    this.addForm = new FormGroup({
      start: new FormControl(null, Validators.required),
      description: new FormControl('')
    });

    this.editForm = new FormGroup({
      start: new FormControl(null, Validators.required),
      description: new FormControl('')
    });

    this.addStopForm = new FormGroup({
      postalCode: new FormControl('', [Validators.required,
                                       Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)]),
      houseNumber: new FormControl('', [Validators.required,
                                        Validators.pattern(/^\d+(\s?[a-zA-Z])?$/)]),
      orderId: new FormControl(null, Validators.required)
    });

    this.editStopForm = new FormGroup({
      postalCode: new FormControl('', [Validators.required,
                                       Validators.pattern(/^\d{4}\s?[a-zA-Z]{2}$/)]),
      houseNumber: new FormControl('', [Validators.required,
                                        Validators.pattern(/^\d+(\s?[a-zA-Z])?$/)]),
      orderId: new FormControl(null, Validators.required),
      routeId: new FormControl(null, Validators.required)
    });
  }

  public setActiveRoute(route: Route): void {
    this.activeRoute = route;
    this.editForm.setValue({
      start: this.activeRoute.start.toLocaleString(),
      description: this.activeRoute.description
    });
  }

  public setActiveStop(stop: Stop): void {
    this.activeStop = stop;
    this.editStopForm.setValue({
      postalCode: this.activeStop.postalCode,
      houseNumber: this.activeStop.houseNumber,
      orderId: this.activeStop.order.id,
      routeId: this.activeStop.routeId
    });
  }

  private addressFormat(str: string): string {
    return str.replaceAll(' ', '').toUpperCase();
  }

  public onAddRoute(): Observable<Route[]> {
    document.getElementById("closeRouteForm")?.click();
    const result$ = this.routeService.addRoute({ ...this.addForm.value, stops: [] });
    this.addForm.reset();
    return result$;
  }

  public onUpdateRoute(): Observable<Route[]> {
    return this.routeService.updateRoute(
      this.activeRoute!.id,
      this.editForm.value.start,
      this.editForm.value.description
    );
  }

  public onDeleteRoute(routeId: number): Observable<Route[]> {
    return this.routeService.deleteRoute(routeId);
  }

  public onAddStop(): Observable<Route[]> {
    document.getElementById("closeStopForm")?.click();
    const result$ = this.stopService.addStop({
      postalCode: this.addressFormat(this.addStopForm.value.postalCode),
      houseNumber: this.addressFormat(this.addStopForm.value.houseNumber),
      orderId: this.addStopForm.value.orderId,
      routeId: this.activeRoute!.id
    }).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    );
    this.addStopForm.reset();
    return result$;
  }

  public onUpdateStop(): Observable<Route[]> {
    return this.stopService.updateStop(
      this.activeStop!.id,
      this.addressFormat(this.editStopForm.value.postalCode),
      this.addressFormat(this.editStopForm.value.houseNumber),
      this.editStopForm.value.orderId,
      this.editStopForm.value.routeId
    ).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    );
  }

  public onDeleteStop(stopId: number): Observable<Route[]> {
    return this.stopService.deleteStop(stopId).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    );
  }
}
