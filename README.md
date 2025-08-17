# DevicePulseDashboard

DevicePulseDashboard is a real-time device monitoring dashboard built with Angular. It visualizes live telemetry and event data from IoT devices using a modern, responsive UI.

## Real-Time Architecture

The app receives live data using a .NET Core SignalR backend. Device telemetry and events are streamed from Azure IoT Hub to a .NET Core server, which then pushes updates to this Angular dashboard via SignalR WebSockets.

**Data Flow:**

1. IoT devices send telemetry and event data to Azure IoT Hub.
2. A .NET Core backend service connects to Azure IoT Hub and processes incoming messages.
3. The backend uses SignalR to broadcast live updates to all connected dashboard clients.
4. The Angular app subscribes to SignalR events and updates charts, metrics, and device status in real time.

**Tech Stack:**

- Angular (standalone components)
- .NET Core SignalR (WebSocket server)
- Azure IoT Hub (device connectivity)
- Chart.js (data visualization)
- Bootstrap (UI layout)

## Additional Resources

For more on Angular CLI, see the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

For .NET Core SignalR, see the [SignalR documentation](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction).

For Azure IoT, see the [Azure IoT Hub documentation](https://learn.microsoft.com/en-us/azure/iot-hub/).
