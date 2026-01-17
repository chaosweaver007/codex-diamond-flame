import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { NodeSDK } from "@opentelemetry/sdk-node";

// Keep logging terse; bump to DEBUG locally if you need verbose output
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const otlpEndpoint =
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const serviceName = process.env.OTEL_SERVICE_NAME || "codex-diamond-flame";
const serviceVersion = process.env.npm_package_version || "dev";

const sdk = otlpEndpoint
    ? new NodeSDK({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
                [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
            }),
            traceExporter: new OTLPTraceExporter({
                url: otlpEndpoint,
                headers: parseOtelHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
            }),
            instrumentations: [getNodeAutoInstrumentations()],
        })
    : null;

function parseOtelHeaders(headers: string | undefined) {
    if (!headers) return undefined;
    const pairs = headers
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((entry) => entry.split("=", 2))
        .filter(([k, v]) => k && v) as Array<[string, string]>;
    return pairs.length ? Object.fromEntries(pairs) : undefined;
}

async function startTracing() {
    if (!sdk) {
        console.log("[Tracing] OTLP endpoint not set; tracing disabled");
        return;
    }

    try {
        await sdk.start();
        console.log(`[Tracing] OpenTelemetry SDK started (OTLP ${otlpEndpoint})`);
    } catch (error) {
        console.error("[Tracing] Failed to start OpenTelemetry SDK", error);
    }
}

function registerShutdownHooks() {
    if (!sdk) return;

    const shutdown = async () => {
        try {
            await sdk.shutdown();
            console.log("[Tracing] OpenTelemetry SDK stopped");
        } catch (error) {
            console.error("[Tracing] Error during OpenTelemetry shutdown", error);
        } finally {
            process.exit(0);
        }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}

registerShutdownHooks();
void startTracing();

export { sdk, otlpEndpoint };