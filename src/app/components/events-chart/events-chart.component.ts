import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Event } from '../../models/telemetry.model';
import { DevicePluseTelemetryService } from '../../services/device-pluse-telemetry.service';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-events-chart',
  templateUrl: './events-chart.component.html',
  styleUrls: ['./events-chart.component.css'],
  imports: [CommonModule],
})
export class EventsChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('eventsChart', { static: true })
  chartRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | undefined;
  private destroy$ = new Subject<void>();
  liveEvents: any[] = [];
  readonly trackedEventTypes = [
    'FallDetected',
    'BatteryDrop',
    'DeviceMoved',
    'BatteryCharging',
  ];

  constructor(private deviceTelemetry: DevicePluseTelemetryService) {}

  ngOnInit(): void {
    // No event subscription here
  }

  ngAfterViewInit(): void {
    this.initChart();
    this.updateBarChart();
    // Subscribe to events after chart is initialized
    this.deviceTelemetry.onEvent((event: any) => {
      // Ignore incomplete events (e.g., only occurredAt)
      if (!event.eventType) {
        console.log('⚠️ Ignored incomplete event:', event);
        return;
      }
      const normalizedEvent = {
        deviceId: event.deviceId,
        eventType: event.eventType,
        description: event.description,
        timestampoccurredAt: event.timestampoccurredAt
          ? new Date(event.timestampoccurredAt)
          : new Date(),
      };
      console.log('📡 Event Received:', normalizedEvent);
      this.liveEvents.push(normalizedEvent);
      // Keep only the last 10 events
      if (this.liveEvents.length > 10) {
        this.liveEvents.shift();
      }
      this.updateBarChart();
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initChart(): void {
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.trackedEventTypes,
        datasets: [
          {
            label: 'Event Count',
            data: [0, 0, 0, 0],
            backgroundColor: [
              '#e74c3c', // FallDetected - red
              '#f1c40f', // BatteryDrop - yellow
              '#3498db', // DeviceMoved - blue
              '#2ecc71', // BatteryCharging - green
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'rgba(255, 255, 255, 0.8)' },
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: 'rgba(255, 255, 255, 0.8)' },
          },
        },
        plugins: { legend: { display: true } },
      },
    };
    this.chart = new Chart(this.chartRef.nativeElement, config);
  }

  private updateBarChart(): void {
    if (!this.chart) return;
    // Count each event type in the last 10 events
    const counts = this.trackedEventTypes.map(
      (type) => this.liveEvents.filter((e) => e.eventType === type).length
    );
    this.chart.data.labels = this.trackedEventTypes;
    this.chart.data.datasets[0].data = counts;
    if (this.chart.options.scales && this.chart.options.scales['y']) {
      this.chart.options.scales['y'].min = 0;
      this.chart.options.scales['y'].max = 10;
    }
    this.chart.update('none');
  }

  private processEventsData(events: Event[]) {
    // Use timestampoccurredAt for filtering events by hour
    const now = new Date();
    const hoursData = [];
    for (let i = 5; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
      const hourEvents = events.filter(
        (e) =>
          e.timestampoccurredAt >= hourStart && e.timestampoccurredAt < hourEnd
      );
      const totalEvents = hourEvents.length;
      // resolved property may not exist in your model, so skip if not needed
      const resolvedEvents = hourEvents.filter((e: any) => e.resolved).length;
      hoursData.push({
        label: hourStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        total: totalEvents,
        resolved: resolvedEvents,
      });
    }
    return hoursData;
  }

  private updateChartWithLiveEvents(): void {
    // Group live events by hour for last 6 hours
    const now = new Date();
    const hoursData = [];
    for (let i = 5; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
      const hourEvents = this.liveEvents.filter(
        (e) =>
          e.timestampoccurredAt >= hourStart && e.timestampoccurredAt < hourEnd
      );
      const totalEvents = hourEvents.length;
      // Count FallDetected events for this hour
      const fallDetectedEvents = hourEvents.filter(
        (e) => e.eventType === 'FallDetected'
      ).length;
      hoursData.push({
        label: hourStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        total: totalEvents,
        fallDetected: fallDetectedEvents,
      });
    }
    // Update chart: total events and fall detected events
    if (this.chart) {
      this.chart.data.labels = hoursData.map((d) => d.label);
      this.chart.data.datasets[0].data = hoursData.map((d) => d.total);
      // Use second dataset for fall detected events
      this.chart.data.datasets[1].data = hoursData.map((d) => d.fallDetected);
      this.chart.update('none');
    }
  }

  private updateChart(data: any[]): void {
    if (!this.chart) return;

    this.chart.data.labels = data.map((d) => d.label);
    this.chart.data.datasets[0].data = data.map((d) => d.total);
    this.chart.data.datasets[1].data = data.map((d) => d.resolved);

    this.chart.update('none');
  }
}
