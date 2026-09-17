import otelSdk from './tracing.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  await otelSdk.start();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 8000);
}
await bootstrap();
