import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { EntityMessagesService } from '@/app/template/messages/entity-messages.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { UserStatus, UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class CreateSimplifiedUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly entityMessages: EntityMessagesService,
  ) {}

  async execute(type: UserType, { document, profile, representativeId }: CreateUserDto) {
    try {
      const group = await this.userGroupRepository.findOneByType(type);
      if (!group) {
        throw new NotFoundError({
          module: 'User',
          code: 'S.CSUS.1',
          message: 'Grupo de usuário não encontrado.',
        });
      }

      const userByDocument = await this.userRepository.findByDocument(document);
      if (userByDocument) {
        throw new ApplicationError({
          module: 'User',
          code: 'S.CSUS.2',
          message: this.entityMessages.getEntityAlreadyRegisteredMessage(
            userByDocument.group.type,
          ),
          status: HttpStatus.CONFLICT,
        });
      }

      if (type !== UserType.DOCTOR) {
        const userByEmail = await this.userRepository.findByEmail(profile.email);
        if (userByEmail) {
          throw new NotFoundError({
            module: 'User',
            code: 'S.CCS.3',
            message: 'E-mail já cadastrado.',
            status: HttpStatus.CONFLICT,
          });
        }
      }

      return this.userRepository.create({
        representativeId,
        groupId: group.id,
        document,
        password: '',
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
        },
        status: UserStatus.MISSING_CONTACT,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new ApplicationError({
        module: 'User',
        code: 'S.CSUS.4',
        message: 'Erro ao criar usuário simplificado.',
        errors: [error],
      });
    }
  }
}
