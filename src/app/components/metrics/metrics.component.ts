import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { DevicePluseTelemetryService } from '../../services/device-pluse-telemetry.service';
@Component({
  selector: 'app-metrics',
  imports: [DatePipe],
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements AfterViewInit, OnDestroy {
  metrics = {
    totalDevices: 1,
    totalEvents: 0,
    activeDevices: 1,
    telemetryCount: 0,
  };
  lastUpdate: Date = new Date();
  dataRate = 0;
  private destroy$ = new Subject<void>();
  private eventCount = 0;
  private telemetryCount = 0;
  private updateCount = 0;
  private startTime = Date.now();
  public batteryLevel = 0;

  constructor(private deviceTelemetry: DevicePluseTelemetryService) {}

  ngAfterViewInit(): void {
    // Listen for live events
    this.deviceTelemetry.onEvent((event: any) => {
      if (!event.eventType) return;
      this.metrics.totalEvents++;
      this.eventCount++;
      this.lastUpdate = event.occurredAt
        ? new Date(event.occurredAt)
        : new Date();
      this.updateCount++;
      this.calculateDataRate();
    });

    // Listen for telemetry data
    this.deviceTelemetry.onTelemetry((telemetry: any) => {
      if (telemetry.battery !== undefined) {
        this.batteryLevel = telemetry.battery.level;
      }
      this.metrics.telemetryCount++;
      this.telemetryCount++;
      this.lastUpdate = telemetry.timestamp
        ? new Date(telemetry.timestamp)
        : new Date();
      this.updateCount++;
      this.calculateDataRate();
    });

    // Listen for device status updates
    this.deviceTelemetry.onDeviceStatus((status: any) => {
      if (status.lastSeen) {
        this.lastUpdate = new Date(status.lastSeen);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBatteryGradient(batteryLevel: number): string {
    const percentage = (batteryLevel / 100) * 360;
    const color =
      batteryLevel > 50 ? '#50e3c2' : batteryLevel > 25 ? '#ffc107' : '#dc3545';
    return `conic-gradient(${color} 0deg, ${color} ${percentage}deg, rgba(255, 255, 255, 0.1) ${percentage}deg)`;
  }

  getSystemStatus(): string {
    if (this.metrics.totalEvents > 5) return 'Critical';
    if (this.metrics.totalEvents > 2 || this.batteryLevel < 30)
      return 'Warning';
    return 'Good';
  }

  getSystemStatusClass(): string {
    const status = this.getSystemStatus();
    return `status-value status-${status.toLowerCase()}`;
  }

  private calculateDataRate(): void {
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    this.dataRate =
      elapsedMinutes > 0 ? Math.round(this.updateCount / elapsedMinutes) : 0;
  }
}
