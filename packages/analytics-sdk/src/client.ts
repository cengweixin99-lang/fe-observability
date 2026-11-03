export interface MonitorConfig {
    endpoint: string;
    projectKey: string;
    environment: string;
    sampleRate?: number;
}

export function createMonitor(config: MonitorConfig) {
    return {
        start() {
            console.log("Monitor started with config:", {
                endpoint: config.endpoint,
                environment: config.environment,
            });
        }
    }
}