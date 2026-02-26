import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { ConfigService } from '@/config/config.service';
import { EmailService } from '@/infra/email/email.service';
import { SecurityService } from '@/infra/security/security.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserType } from '../enums/user.enum';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly email: EmailService,
    private readonly config: ConfigService,
    private readonly security: SecurityService,
    private readonly userRepository: UserRepository,
    private readonly userGroupRepository: UserGroupRepository,
  ) {}

  async execute(data: CreateUserDto) {
    const userByDocument = await this.userRepository.findByDocument(data.document);
    if (userByDocument) {
      throw new ApplicationError({
        module: 'User',
        code: 'S.CUS.1',
        message: 'Usuário já cadastrado.',
        status: HttpStatus.CONFLICT,
      });
    }

    const userByEmail = await this.userRepository.findByEmail(data.profile.email);
    if (userByEmail) {
      throw new ApplicationError({
        module: 'User',
        code: 'S.CUS.2',
        message: 'E-mail já cadastrado.',
        status: HttpStatus.CONFLICT,
      });
    }

    const group = await this.userGroupRepository.findOne(data.groupId);
    if (!group) {
      throw new ApplicationError({
        module: 'User',
        code: 'S.CUS.2',
        message: 'Grupo de usuário não encontrado.',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (data.representativeId) {
      const representative = await this.userRepository.findOne(data.representativeId);
      if (!representative) {
        throw new ApplicationError({
          module: 'User',
          code: 'S.CUS.3',
          message: 'Representante não encontrado.',
          status: HttpStatus.NOT_FOUND,
        });
      }
    }

    const temporaryPassword = this.security.generatePassword({
      length: 12,
    });

    const createdUser = await this.userRepository.create({
      ...data,
      password: await this.security.hashPassword(temporaryPassword),
    });

    if ([UserType.EMPLOYEE, UserType.ADMIN].includes(group.type as UserType)) {
      try {
        await this.email.sendEmail({
          template: 'signup',
          to: [data.profile.email],
          subject: 'Novo cadastro realizado',
          data: {
            cdnUrl: this.config.AWS_CLOUDFRONT_URL,
            document: data.document,
            password: temporaryPassword,
            name: data.profile.firstName.toCapitalized(),
            href: this.config.APP_URL,
          },
        });

        return createdUser;
      } catch (error) {
        throw new ApplicationError({
          module: 'User',
          code: 'S.CUS.4',
          message: 'Erro ao enviar e-mail de cadastro.',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: [error],
        });
      }
    }

    return createdUser;
  }
}
