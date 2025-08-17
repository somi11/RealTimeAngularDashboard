export interface Event {
  deviceId: string;
  eventType: 'FallDetected' | 'BatteryDrop' | 'DeviceMoved' | 'BatteryCharging';
  description: string;
  timestampoccurredAt: Date;
}
