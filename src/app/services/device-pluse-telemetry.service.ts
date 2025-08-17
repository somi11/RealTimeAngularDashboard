import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class DevicePluseTelemetryService {
  private hubConnection!: signalR.HubConnection;

  constructor() {}

  startConnection(onConnected?: () => void) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7128/telemetryHub') // API Hub endpoint
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR Connected');
        this.hubConnection.invoke(
          'SubscribeDevice',
          'c3a8e1c7-9e54-4a7d-a3a7-6f3e4f2c2989'
        );
        if (onConnected) onConnected();
      })
      .catch((err) => console.error('❌ Error connecting SignalR:', err));
  }

  subscribeToDevice(deviceId: string) {
    this.hubConnection.invoke('SubscribeDevice', deviceId);
  }

  unsubscribeFromDevice(deviceId: string) {
    this.hubConnection.invoke('UnsubscribeDevice', deviceId);
  }

  onDeviceStatus(callback: (data: any) => void) {
    this.hubConnection.on('ReceivedDeviceStatus', callback);
  }

  onTelemetry(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveTelemetry', callback);
  }

  onEvent(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveEvent', callback);
  }
}
