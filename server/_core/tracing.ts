import { sdk, otlpEndpoint } from "<MODULE_PATH>";

(async () => { 
    try { 
        await sdk.start(); 
        console.log(`[Tracing] OpenTelemetry SDK started (OTLP ${otlpEndpoint})`); 
    } catch (error) { 
        console.error("[Tracing] Failed to start OpenTelemetry SDK", error); 
    } 
})();

// ... rest of the file contents ...