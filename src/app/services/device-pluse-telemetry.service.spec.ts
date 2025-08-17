import { TestBed } from '@angular/core/testing';

import { DevicePluseTelemetryService } from './device-pluse-telemetry.service';

describe('DevicePluseTelemetryService', () => {
  let service: DevicePluseTelemetryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicePluseTelemetryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
