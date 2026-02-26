import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginService } from '@/app/auth/services/login.service';
import { CreateSessionDto } from '@/app/session/interfaces/create-session.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('/auth')
export class AuthLoginController {
  constructor(private readonly authLogin: AuthLoginService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Efetuar login',
    description: 'Entrar com as credenciais de acesso.',
  })
  async handle(@Body() data: CreateSessionDto) {
    return this.authLogin.execute(data);
  }
}
