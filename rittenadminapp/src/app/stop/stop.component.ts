import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Route } from '../route/route';
import { RouteService } from '../route/route.service';
import { Stop } from './stop';
import { StopService } from './stop.service';

@Component({
  selector: 'app-stop',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stop.component.html',
  styleUrl: './stop.component.css'
})
export class StopComponent {
  @Input() public stop: Stop | null = null;
  @Output() public newActiveStopEvent = new EventEmitter<Stop>();
  @Output() public stopDeliveredEvent = new EventEmitter<Observable<Route[]>>();

  private stopService: StopService = inject(StopService);
  private routeService: RouteService = inject(RouteService);

  public onDeliverStop(stopId: number): void {
    this.stopDeliveredEvent.emit(this.stopService.deliverStop(stopId).pipe(
      switchMap(() => this.routeService.getAllRoutes())
    ));
  }

  public setActiveStop(stop: Stop): void {
    this.newActiveStopEvent.emit(stop);
  }
}
