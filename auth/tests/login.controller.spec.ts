import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '@/test/test.module';
import { UserModule } from '@/app/user/user.module';
import { SessionModule } from '@/app/session/session.module';
import { AuthLoginController } from '../controllers/login.controller';
import { TestingService } from '@/test/test.service';
import { AuthLoginService } from '@/app/auth/services/login.service';

describe('Controller::Login', () => {
  let controller: AuthLoginController;
  let testing: TestingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TestModule, UserModule, SessionModule],
      controllers: [AuthLoginController],
      providers: [AuthLoginService],
    }).compile();

    controller = app.get<AuthLoginController>(AuthLoginController);
    testing = app.get<TestingService>(TestingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(testing).toBeDefined();
  });
});
