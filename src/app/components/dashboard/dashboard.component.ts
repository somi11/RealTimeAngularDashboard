import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceListComponent } from '../device-list/device-list.component';
import { RecentEventsComponent } from '../recent-events/recent-events.component';
import { TelemetryChartComponent } from '../telemetry-chart/telemetry-chart.component';
import { EventsChartComponent } from '../events-chart/events-chart.component';
import { MetricsComponent } from '../metrics/metrics.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DeviceListComponent,
    RecentEventsComponent,
    TelemetryChartComponent,
    EventsChartComponent,
    MetricsComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit(): void {
    // Component initialization if needed
  }

  ngOnDestroy(): void {}
}
