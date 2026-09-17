import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from './prisma.service.js';
import { RedisService } from './redis.service.js';
import { RabbitMqService } from './rabbitmq.service.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicator: HealthIndicatorService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly rabbitmq: RabbitMqService,
  ) {}

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('postgres', this.prisma),
      () =>
        this.healthIndicator
          .check('redis')
          .attempt(async () => {
            if (!this.redis.isConnected()) {
              throw new Error('Redis client is not connected');
            }
            return { connected: true };
          })
          .withTimeout(1000),
      () =>
        this.healthIndicator
          .check('rabbitmq')
          .attempt(() => {
            if (!this.rabbitmq.isConnected()) {
              throw new Error('RabbitMQ client is not connected');
            }
            return { connected: true };
          })
          .withTimeout(1000),
    ]);
  }
}
