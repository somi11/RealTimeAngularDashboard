import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DevicePluseTelemetryService } from '../../services/device-pluse-telemetry.service';

Chart.register(...registerables);

@Component({
  selector: 'app-telemetry-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './telemetry-chart.component.html',
  styleUrls: ['./telemetry-chart.component.css'],
})
export class TelemetryChartComponent implements OnInit, OnDestroy {
  @ViewChild('telemetryChart', { static: true })
  chartRef!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  selectedDeviceId: string | null = null;
  public loading = true;

  constructor(private telemetryService: DevicePluseTelemetryService) {}

  ngOnInit(): void {
    this.initChart();

    // start SignalR connection
    this.telemetryService.startConnection();

    // listen for telemetry from SignalR hub
    this.telemetryService.onTelemetry((data: any) => {
      console.log('📡 Telemetry Received:', data);
      this.updateChart(data);
      this.loading = false;
    });

    this.selectedDeviceId = 'c3a8e1c7-9e54-4a7d-a3a7-6f3e4f2c2989';
    this.telemetryService.subscribeToDevice(this.selectedDeviceId);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.selectedDeviceId) {
      this.telemetryService.unsubscribeFromDevice(this.selectedDeviceId);
    }
  }

  /** Initialize chart.js config */
  private initChart(): void {
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Acceleration X',
            data: [],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231,76,60,0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Acceleration Y',
            data: [],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39,174,96,0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Acceleration Z',
            data: [],
            borderColor: '#2980b9',
            backgroundColor: 'rgba(41,128,185,0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Battery Level',
            data: [],
            borderColor: '#f1c40f',
            backgroundColor: 'rgba(241,196,15,0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            yAxisID: 'battery-axis',
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff', // legend text white
            },
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' }, // X axis labels white
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Acceleration (m/s²)',
              color: '#ffffff',
            },
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
          'battery-axis': {
            beginAtZero: true,
            position: 'right',
            grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.1)' },
            title: { display: true, text: 'Battery (%)', color: '#ffffff' },
            ticks: { color: '#ffffff' },
          },
        },
      },
    };

    this.chart = new Chart(this.chartRef.nativeElement, config);
  }

  /** Update chart when telemetry arrives */
  private updateChart(data: any): void {
    if (!this.chart) return;

    const timestamp = new Date(data.timestamp).toLocaleTimeString();
    const accX = data.acceleration?.x ?? 0;
    const accY = data.acceleration?.y ?? 0;
    const accZ = data.acceleration?.z ?? 0;
    const battery = data.battery?.level ?? 0;

    this.chart.data.labels?.push(timestamp);
    (this.chart.data.datasets[0].data as number[]).push(accX);
    (this.chart.data.datasets[1].data as number[]).push(accY);
    (this.chart.data.datasets[2].data as number[]).push(accZ);
    (this.chart.data.datasets[3].data as number[]).push(battery);

    // keep last 10 points
    if (this.chart.data.labels!.length > 10) {
      this.chart.data.labels!.shift();
      this.chart.data.datasets.forEach((ds) => {
        (ds.data as number[]).shift();
      });
    }

    this.chart.update('none');
  }
}
