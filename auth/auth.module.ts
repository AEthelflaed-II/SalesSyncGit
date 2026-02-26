import { Global, Module } from '@nestjs/common';
import { SecurityModule } from '@/infra/security/security.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { EnsureAuthMiddleware } from './middlewares/ensure-auth.middleware';
import { AuthLoginController } from '@/api/auth/controllers/login.controller';
import { AuthRefreshController } from '@/api/auth/controllers/refresh.controller';
import { AuthLoginService } from './services/login.service';
import { AuthRefreshService } from './services/refresh.service';

@Global()
@Module({
  imports: [SecurityModule, SessionModule, UserModule],
  controllers: [AuthLoginController, AuthRefreshController],
  providers: [EnsureAuthMiddleware, AuthLoginService, AuthRefreshService],
  exports: [SessionModule],
})
export class AuthModule {}
