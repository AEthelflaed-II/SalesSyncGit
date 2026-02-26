import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { SecurityModule } from '@/infra/security/security.module';
import { ConfigModule } from '@/config/config.module';
import { TestingService } from './test.service';

@Module({
  imports: [DatabaseModule, ConfigModule, SecurityModule],
  providers: [TestingService],
  exports: [SecurityModule],
})
export class TestModule {}
