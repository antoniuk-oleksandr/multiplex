import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database.module.js';
import { HealthModule } from './health.module.js';
import { LoggerModule } from 'nestjs-pino';
import { RedisModule } from './redis.module.js';
import { RabbitMqModule } from './rabbitmq.module.js';
import { MetricsController } from './metrics.controller.js';
import { httpMetricsMiddleware } from './http-metrics.middleware.js';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    RabbitMqModule,
    HealthModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        autoLogging: false,
        base: { service: process.env.OTEL_SERVICE_NAME ?? 'multiplex-api' },
        timestamp: true,
        formatters: {
          level: (label: string) => ({ level: label }),
        },
      },
    }),
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(httpMetricsMiddleware).forRoutes('*');
  }
}
