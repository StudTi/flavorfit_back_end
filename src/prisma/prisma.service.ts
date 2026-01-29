/* eslint-disable @tipescript-eslint/no-unsafe-call*/
/* eslint-disable @tipescript-eslint/no-unsafe-assigment*/
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from "prisma/generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool

  private readonly logger: Logger

  constructor(
    private readonly configService: ConfigService
  ) {
    const connectionString = configService.getOrThrow("DATABASE_URL")

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    super({ adapter })
    this.pool = pool
    this.logger = new Logger ("PrismaService")
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Prisma connected to PostgreSQL')
  }

  async onModuleDestroy() {
    await this.$disconnect()
    await this.pool.end()
    this.logger.log('Prisma disconnected from PostgreSQL')
  }
}






