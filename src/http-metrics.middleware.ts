import type { NextFunction, Request, Response } from 'express';
import { Counter, Histogram } from 'prom-client';

const requests = new Counter({
  name: 'multiplex_http_requests_total',
  help: 'Total number of HTTP requests handled by the API.',
  labelNames: ['method', 'route', 'status_code'] as const,
});

const duration = new Histogram({
  name: 'multiplex_http_request_duration_seconds',
  help: 'HTTP request duration in seconds.',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

export function httpMetricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/metrics') {
    next();
    return;
  }

  const started = process.hrtime.bigint();
  res.once('finish', () => {
    const route = req.route?.path ?? req.path ?? 'unknown';
    const labels = {
      method: req.method,
      route: String(route),
      status_code: String(res.statusCode),
    };
    const seconds = Number(process.hrtime.bigint() - started) / 1e9;
    requests.inc(labels);
    duration.observe(labels, seconds);
  });
  next();
}
