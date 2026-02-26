import { Injectable } from '@nestjs/common';
import { UserType } from '@/app/user/enums/user.enum';

interface EntityMap {
  [key: string]: string[];
}

type EntityType = UserType | string;

export enum EntityOptions {
  SINGULAR = 0,
  SINGULAR_LOWER = 1,
  SINGULAR_UPPER = 2,
  PLURAL = 3,
  PLURAL_LOWER = 4,
  PLURAL_UPPER = 5,
}

@Injectable()
export class EntityMessagesService {
  private readonly map: EntityMap = {
    [UserType.ADMIN]: ['Administrador', 'es'],
    [UserType.EMPLOYEE]: ['Funcionário', 's'],
    [UserType.REPRESENTATIVE]: ['Representante', 's'],
    [UserType.DOCTOR]: ['Médico', 's'],
    [UserType.CUSTOMER]: ['Cliente', 's'],
  };

  getEntityName(
    type: EntityType,
    option: EntityOptions = EntityOptions.SINGULAR,
  ): string {
    return [
      this.map[type][0],
      this.map[type][0].toLowerCase(),
      this.map[type][0].toUpperCase(),
      this.map[type][0] + this.map[type][1],
      this.map[type][0].toLowerCase() + this.map[type][1],
      this.map[type][0].toUpperCase() + this.map[type][1],
    ][option];
  }

  getEntityAlreadyRegisteredMessage(type: EntityType): string {
    return `${this.getEntityName(type)} já cadastrado.`;
  }

  getEntityNotFoundMessage(type: EntityType): string {
    return `${this.getEntityName(type)} não encontrado.`;
  }
}
