import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMqService } from './rabbitmq.service.js';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ??
              `amqp://${encodeURIComponent(process.env.RABBITMQ_USER ?? 'admin')}:${encodeURIComponent(process.env.RABBITMQ_PASSWORD ?? 'admin')}@${process.env.RABBITMQ_HOST ?? 'localhost'}:${process.env.RABBITMQ_PORT ?? '5672'}`,
          ],
          queue: process.env.RABBITMQ_QUEUE ?? 'multiplex-api',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
