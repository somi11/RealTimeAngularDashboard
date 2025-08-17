import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetryChartComponent } from './telemetry-chart.component';

describe('TelemetryChartComponent', () => {
  let component: TelemetryChartComponent;
  let fixture: ComponentFixture<TelemetryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelemetryChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelemetryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
