export interface MonitorConfig {
    endpoint: string;
    projectKey: string;
    environment: string;
    sampleRate?: number;
}

function buildEvent(config: MonitorConfig, eventName: string, eventType: 'business' | 'performance' | 'error', properties: Record<string, unknown> = {}) {
    return {
        projectKey: config.projectKey,
        eventId: crypto.randomUUID(),
        eventName,
        eventType,
        sessionId: `session-${Date.now()}`,
        occurredAt: new Date().toISOString(),
        properties,
    };
}

export function createMonitor(config: MonitorConfig) {
    async function send(eventName: string, eventType: 'business' | 'performance' | 'error', properties: Record<string, unknown> = {}) {
        const event = buildEvent(config, eventName, eventType, properties);

        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                throw new Error(`Request failed with ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('Telemetry send failed:', error);
            return null;
        }
    }

    return {
        start() {
            console.log('Monitor started with config:', {
                endpoint: config.endpoint,
                environment: config.environment,
            });
        },
        track(eventName: string, properties: Record<string, unknown> = {}) {
            return send(eventName, 'business', properties);
        },
        capture(eventName: string, properties: Record<string, unknown> = {}) {
            return send(eventName, 'business', properties);
        },
        reportPerformance(eventName: string, properties: Record<string, unknown> = {}) {
            return send(eventName, 'performance', properties);
        },
        reportError(eventName: string, properties: Record<string, unknown> = {}) {
            return send(eventName, 'error', properties);
        },
    };
}