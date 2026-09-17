import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4317';

const otelSdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? 'multiplex-api',
  traceExporter: new OTLPTraceExporter({ url: endpoint }),
  instrumentations: [
    new RuntimeNodeInstrumentation(),
    new PgInstrumentation(),
    new IORedisInstrumentation(),
    new AmqplibInstrumentation(),
    new AwsInstrumentation(),
    ...getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: false },
    }),
  ],
});

export default otelSdk;
