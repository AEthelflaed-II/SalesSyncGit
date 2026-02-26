import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { ResourceBaseParams } from '@/infra/base/interfaces/request-params.interfaces';
import { Prisma } from '@prisma/client';

@Injectable()
export class FindUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: ResourceBaseParams) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UF.0001',
        message: 'Usuário não encontrado.',
      });
    }

    return user;
  }

  async byEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UF.0002',
        message: 'Usuário não encontrado.',
      });
    }

    return user;
  }

  async byDocument(
    document: string,
    filters?: Omit<Prisma.UserWhereUniqueInput, 'document'>,
    options: { withPassword?: boolean; withRepresentative?: boolean } = {
      withPassword: false,
      withRepresentative: true,
    },
  ) {
    const user = await this.userRepository.findByDocument(
      document,
      filters,
      options.withPassword,
      options.withRepresentative,
    );

    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UF.0003',
        message: 'Usuário não encontrado.',
      });
    }

    return user;
  }

  async byDocumentWithoutThrow(
    document: string,
    filters?: Omit<Prisma.UserWhereUniqueInput, 'document'>,
    options: { withPassword?: boolean; withRepresentative?: boolean } = {
      withPassword: false,
      withRepresentative: true,
    },
  ) {
    return this.userRepository.findByDocument(
      document,
      filters,
      options.withPassword,
      options.withRepresentative,
    );
  }

  async byFullName(
    fullName: string,
    filters?: Omit<Prisma.UserWhereInput, 'profile'>,
    options: { withPassword?: boolean; withRepresentative?: boolean } = {
      withPassword: false,
      withRepresentative: true,
    },
  ) {
    const user = await this.userRepository.findByFullName(
      fullName,
      filters,
      options.withPassword,
      options.withRepresentative,
    );

    if (!user) {
      throw new NotFoundError({
        module: 'User',
        code: 'S.UF.0004',
        message: 'Usuário não encontrado.',
      });
    }

    return user;
  }

  async byFullNameWithoutThrow(
    fullName: string,
    filters?: Omit<Prisma.UserWhereInput, 'profile'>,
    options: { withPassword?: boolean; withRepresentative?: boolean } = {
      withPassword: false,
      withRepresentative: true,
    },
  ) {
    return this.userRepository.findByFullName(
      fullName,
      filters,
      options.withPassword,
      options.withRepresentative,
    );
  }
}
