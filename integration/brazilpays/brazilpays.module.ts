import { Module } from '@nestjs/common';
import { BrazilPaysService } from './brazilpays.service';

@Module({
  providers: [BrazilPaysService],
})
export class BrazilPaysModule {}
