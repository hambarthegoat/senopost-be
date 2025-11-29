import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const raw = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_URL;
    const connectionString = raw ? raw.replace(/^"|"$/g, '') : undefined;

    if (!connectionString) {
      throw new Error('No database connection string found. Set DIRECT_URL or DATABASE_URL in your environment.');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
