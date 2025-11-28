import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma v7 requires an adapter for the client when using the "client" engine
    // Use the Node Postgres adapter to connect to Postgres/Supabase
    // `as any` is used to avoid typing issues in older @prisma/client type defs here.
    super({ adapter: 'node-postgres' as any });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
