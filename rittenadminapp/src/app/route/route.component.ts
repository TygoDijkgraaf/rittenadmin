import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { merge, Observable, of, startWith, Subject, switchMap, Subscription, combineLatest, map } from 'rxjs';
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
export class RouteComponent implements OnInit, OnDestroy {
  private routeService: RouteService = inject(RouteService);
  private stopService: StopService = inject(StopService);
  private orderService: OrderService = inject(OrderService);
  public activeRoute: Route | null = null;
  public activeStop: Stop | null = null;

  addForm!: FormGroup;
  editForm!: FormGroup;
  addStopForm!: FormGroup;
  editStopForm!: FormGroup;
  searchBar: FormControl = new FormControl('');

  postalCodeErrorMessage = '';
  private postalCodeValidationMessages: { [key: string]: string } = {
    required: 'Please enter a postal code',
    pattern: 'Please enter a valid postal code'
  }

  houseNumberErrorMessage = '';
  private houseNumberValidationMessages: { [key: string]: string } = {
    required: 'Please enter a house number',
    pattern: 'Please enter a valid house number'
  }

  private subs: Subscription[] = [];

  routeActionSubject = new Subject<{ action: string, data?: any }>();
  stopActionSubject = new Subject<{ action: string, data?: any }>();
  routeAction$ = this.routeActionSubject.asObservable();
  stopAction$ = this.stopActionSubject.asObservable();

  action$ = merge(
    this.routeAction$,
    this.stopAction$
  );

  orders$ = this.orderService.getAllOrders();
  allRoutes$ = this.action$.pipe(
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
          return this.routeService.getAllRoutes();
      }
    })
  );

  routes$ = combineLatest([
    this.allRoutes$,
    this.searchBar.valueChanges.pipe(
      startWith('')
    )
  ]).pipe(
    map(([routes, searchTerm]) =>
      routes.filter(route =>
        route.id.toString().includes(searchTerm) ||
        route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        this.stopsMatchSearchTerm(route.stops, searchTerm)
      )
    )
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

    const postalCodeControlAdd = this.addStopForm.get('postalCode');
    this.subs.push(postalCodeControlAdd!.valueChanges.subscribe(
      () => this.setPostalCodeMessage(postalCodeControlAdd!)
    ));

    const houseNumberControlAdd = this.addStopForm.get('houseNumber');
    this.subs.push(houseNumberControlAdd!.valueChanges.subscribe(
      () => this.setHouseNumberMessage(houseNumberControlAdd!)
    ));

    const postalCodeControlEdit = this.editStopForm.get('postalCode');
    this.subs.push(postalCodeControlEdit!.valueChanges.subscribe(
      () => this.setPostalCodeMessage(postalCodeControlEdit!)
    ));

    const houseNumberControlEdit = this.editStopForm.get('houseNumber');
    this.subs.push(houseNumberControlEdit!.valueChanges.subscribe(
      () => this.setHouseNumberMessage(houseNumberControlEdit!)
    ));
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }

  private stopsMatchSearchTerm(stops: Stop[], searchTerm: string): boolean {
    for (let stop of stops) {
      if (stop.postalCode.includes(searchTerm.toUpperCase())) return true;
      if (stop.houseNumber.includes(searchTerm.toUpperCase())) return true;
      if (stop.order.orderNumber.includes(searchTerm.toUpperCase())) return true;
    }
    return false;
  }

  private setPostalCodeMessage(c: AbstractControl): void {
    this.postalCodeErrorMessage = '';
    if (c.dirty && c.errors) {
      this.postalCodeErrorMessage = Object.keys(c.errors).map(
        key => this.postalCodeValidationMessages[key]
      ).join(' ');
    }
  }

  private setHouseNumberMessage(c: AbstractControl): void {
    this.houseNumberErrorMessage = '';
    if (c.dirty && c.errors) {
      this.houseNumberErrorMessage = Object.keys(c.errors).map(
        key => this.houseNumberValidationMessages[key]
      ).join(' ');
    }
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
