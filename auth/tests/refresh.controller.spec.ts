import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '@/test/test.module';
import { UserModule } from '@/app/user/user.module';
import { SessionModule } from '@/app/session/session.module';
import { AuthRefreshController } from '../controllers/refresh.controller';
import { TestingService } from '@/test/test.service';
import { AuthLoginService } from '@/app/auth/services/login.service';
import { AuthRefreshService } from '@/app/auth/services/refresh.service';

describe('Controller::Refresh', () => {
  let controller: AuthRefreshController;
  let service: AuthLoginService;
  let testing: TestingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TestModule, UserModule, SessionModule],
      controllers: [AuthRefreshController],
      providers: [AuthLoginService, AuthRefreshService],
    }).compile();

    controller = app.get<AuthRefreshController>(AuthRefreshController);
    service = app.get<AuthLoginService>(AuthLoginService);
    testing = app.get<TestingService>(TestingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(testing).toBeDefined();
  });
});
