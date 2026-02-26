import { Module } from '@nestjs/common';
import { TristarService } from './tristar.service';

@Module({
  providers: [TristarService],
})
export class TristarModule {}
