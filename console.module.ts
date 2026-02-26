import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseModule } from '@/infra/database/database.module';
import { SecurityModule } from '@/infra/security/security.module';
import { SecurityService } from '@/infra/security/security.service';
import { UserModule } from '@/app/user/user.module';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { PopulateDefaultCommand } from './commands/populate-default.command';
import { PopulateProductsCommand } from './commands/populate-products.command';
import { PopulateUserGroupsCommand } from './commands/populate-user-groups.command';
import { PopulateStocksCommand } from './commands/populate-stocks.command';

@Module({
  imports: [ConfigModule, ConsoleModule, DatabaseModule, SecurityModule, UserModule],
  providers: [
    UserRepository,
    SecurityService,
    PopulateDefaultCommand,
    PopulateStocksCommand,
    PopulateProductsCommand,
    PopulateUserGroupsCommand,
  ],
})
export class AppConsoleModule {}
