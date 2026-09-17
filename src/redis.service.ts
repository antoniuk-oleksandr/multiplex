import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private connected = false;

  constructor(@Inject('REDIS_CLIENT') private readonly client: ClientProxy) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
    this.connected = true;
  }

  async onModuleDestroy(): Promise<void> {
    this.client.close();
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
