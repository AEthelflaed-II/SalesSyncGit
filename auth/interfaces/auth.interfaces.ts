import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthRefreshDto {
  @ApiProperty({
    type: String,
    format: 'base64',
    description: 'Token de atualização',
  })
  @IsString()
  refreshToken: string;
}
