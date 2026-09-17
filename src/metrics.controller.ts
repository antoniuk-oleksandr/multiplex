import { Controller, Get, Header } from '@nestjs/common';
import { collectDefaultMetrics, Gauge, register } from 'prom-client';
import { performance } from 'node:perf_hooks';

collectDefaultMetrics({ prefix: 'multiplex_' });

const eventLoopUtilization = new Gauge({
  name: 'multiplex_nodejs_eventloop_utilization_ratio',
  help: 'Fraction of time the Node.js event loop is active.',
  collect() {
    this.set(performance.eventLoopUtilization().utilization);
  },
});

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  metrics(): Promise<string> {
    return register.metrics();
  }
}
