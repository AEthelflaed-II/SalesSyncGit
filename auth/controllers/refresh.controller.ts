import { Body, Controller, Post } from '@nestjs/common';
import { AuthRefreshService } from '@/app/auth/services/refresh.service';
import { AuthRefreshDto } from '@/app/auth/interfaces/auth.interfaces';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('/auth')
export class AuthRefreshController {
  constructor(private readonly authRefresh: AuthRefreshService) {}

  @Post('/refresh')
  @ApiOperation({
    summary: 'Atualizar token de acesso',
    description: 'Atualiza o token de acesso com base no token de atualização.',
  })
  async handle(@Body() data: AuthRefreshDto) {
    return this.authRefresh.execute(data);
  }
}
