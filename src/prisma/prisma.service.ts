import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async onModuleInit() {
    this.logger.log('Attempting to connect to database...', PrismaService.name);
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database', PrismaService.name);
    } catch (error) {
      this.logger.error(
        'Failed to connect to database',
        error,
        PrismaService.name,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...', PrismaService.name);
    await this.$disconnect();
    this.logger.log('Disconnected from database', PrismaService.name);
  }
}
