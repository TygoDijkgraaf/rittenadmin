import { Component, Input, Output, inject, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stop } from './stop';
import { StopService } from './stop.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './stop.component.html',
  styleUrl: './stop.component.css'
})
export class StopComponent {
  @Input() public stop: Stop | null = null;
  @Output() public newActiveStopEvent = new EventEmitter<Stop>();
  @Output() public updateHappened = new EventEmitter<void>();

  private stopService: StopService = inject(StopService);

  public onDeliverStop(stopId: number): void {
    this.stopService.deliverStop(stopId).subscribe({
      next: (response: string) => {
        console.log(response);
        this.updateHappened.emit();
      },
      error: (error: HttpErrorResponse) => {
        const backendError = JSON.parse(error.error);
        alert(backendError.message);
      }
    });
  }

  public setActiveStop(stop: Stop): void {
    this.newActiveStopEvent.emit(stop);
  }
}
