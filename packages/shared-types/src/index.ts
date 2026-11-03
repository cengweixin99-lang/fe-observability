export interface TelemetryEvent {
    schemaVersion: 1;
    eventId: string;
    eventName: string;
    eventType: "business" | "performance" | "error";
    timestamp: number;
    projectId: string;
    sessionId: string;
    properties: Record<string, unknown>;
}