import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';
import { SecurityService } from '../security.service';

describe('Service::Security', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
