import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEventsComponent } from './recent-events.component';

describe('RecentEventsComponent', () => {
  let component: RecentEventsComponent;
  let fixture: ComponentFixture<RecentEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
