import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { DevicePluseTelemetryService } from '../../services/device-pluse-telemetry.service';

@Component({
  selector: 'app-recent-events',
  templateUrl: './recent-events.component.html',
  styleUrls: ['./recent-events.component.css'],
  imports: [NgFor, NgIf],
})
export class RecentEventsComponent implements AfterViewInit, OnDestroy {
  recentEvents: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private deviceTelemetry: DevicePluseTelemetryService) {}

  ngAfterViewInit(): void {
    this.deviceTelemetry.onEvent((event: any) => {
      // Ignore incomplete events
      if (!event.eventType) return;
      const normalizedEvent = {
        deviceId: event.deviceId,
        eventType: event.eventType,
        description: event.description,
        occurredAt: event.occurredAt ? new Date(event.occurredAt) : new Date(),
      };
      this.recentEvents.unshift(normalizedEvent);
      // Keep only the last 5 events
      if (this.recentEvents.length > 5) {
        this.recentEvents.pop();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEventIcon(type: string): string {
    const icons: Record<string, string> = {
      FallDetected: 'fas fa-exclamation-triangle text-warning',
      BatteryDrop: 'fas fa-battery-quarter text-warning',
      DeviceMoved: 'fas fa-arrows-alt text-info',
      BatteryCharging: 'fas fa-bolt text-success',
    };
    return icons[type] || 'fas fa-info-circle text-secondary';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
