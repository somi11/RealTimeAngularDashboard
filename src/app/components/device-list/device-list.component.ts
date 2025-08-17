import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DevicePluseTelemetryService } from '../../services/device-pluse-telemetry.service';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'device-list.component.html',
  styleUrls: ['device-list.component.css'],
})
export class DeviceListComponent implements OnInit, OnDestroy {
  deviceId = 'c3a8e1c7-9e54-4a7d-a3a7-6f3e4f2c2989';
  deviceStatus: any = null;

  private destroy$ = new Subject<void>();

  constructor(private telemetryService: DevicePluseTelemetryService) {}

  ngOnInit(): void {
    this.telemetryService.startConnection(() => {
      this.telemetryService.onDeviceStatus((data) => {
        console.log('📡 Status Received:', data);
        if (data.deviceId === this.deviceId) {
          this.deviceStatus = data;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.telemetryService.unsubscribeFromDevice(this.deviceId);
  }

  get statusDot(): string {
    if (!this.deviceStatus) return 'inactive';
    if (this.deviceStatus.status?.toLowerCase().includes('low'))
      return 'warning';
    return 'active';
  }
}
