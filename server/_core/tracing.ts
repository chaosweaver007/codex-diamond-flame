import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const isTracingDisabled =
  process.env.OTEL_SDK_DISABLED === "true" ||
  process.env.TRACING_DISABLED === "true";

if (!isTracingDisabled) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

  const rawOtlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
  const otlpEndpoint = rawOtlpEndpoint
    ? (() => {
        const normalized = rawOtlpEndpoint.replace(/\/+$/, "");
        return /\/v1\/traces$/.test(normalized)
          ? normalized
          : `${normalized}/v1/traces`;
      })()
    : "http://localhost:4318/v1/traces";

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME || "codex-diamond-flame",
      [SemanticResourceAttributes.SERVICE_VERSION]:
        process.env.npm_package_version,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
        process.env.NODE_ENV || "development",
    }),
    traceExporter: new OTLPTraceExporter({ url: otlpEndpoint }),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-http": {
          ignoreIncomingRequestHook: req => req.url === "/healthz",
        },
      }),
    ],
  });

  try {
    sdk.start();
    console.log(`[Tracing] OpenTelemetry SDK started (OTLP ${otlpEndpoint})`);
  } catch (error) {
    console.error("[Tracing] Failed to start OpenTelemetry SDK", error);
  }

  const shutdown = async () => {
    try {
      await sdk.shutdown();
      console.log("[Tracing] OpenTelemetry SDK shut down");
    } catch (error) {
      console.error("[Tracing] Error shutting down OpenTelemetry SDK", error);
    }
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
  process.once("beforeExit", shutdown);
} else {
  console.log("[Tracing] OpenTelemetry tracing disabled via env flag");
}
