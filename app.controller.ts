import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Status',
    description: 'Rota para verificar o status da aplicação',
  })
  root() {
    return this.app.root();
  }
}
