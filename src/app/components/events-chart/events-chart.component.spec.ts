import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsChartComponent } from './events-chart.component';

describe('EventsChartComponent', () => {
  let component: EventsChartComponent;
  let fixture: ComponentFixture<EventsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
