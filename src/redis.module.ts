import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from './redis.service.js';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: Number(process.env.REDIS_PORT ?? 6379),
        },
      },
    ]),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
