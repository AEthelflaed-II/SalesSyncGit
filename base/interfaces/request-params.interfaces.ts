import { IsUUID } from 'class-validator';

export class ResourceBaseParams {
  @IsUUID(4, { message: 'O identificador deve ser um UUIDv4.' })
  id: string;
}
