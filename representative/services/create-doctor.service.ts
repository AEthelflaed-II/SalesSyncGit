import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { UserGroupRepository } from '@/infra/database/prisma/repositories/user-group.repository';
import { EntityMessagesService } from '@/app/template/messages/entity-messages.service';
import { CreateUserDto } from '@/app/user/dtos/create-user.dto';
import { UserStatus, UserType } from '@/app/user/enums/user.enum';

@Injectable()
export class CreateDoctorService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly entityMessages: EntityMessagesService,
  ) {}

  async execute({ document, profile }: CreateUserDto) {
    const doctorGroup = await this.userGroupRepository.findOneByType(
      UserType.DOCTOR,
    );

    if (!doctorGroup) {
      throw new NotFoundError({
        module: 'Doctor',
        code: 'S.CDS.1',
        message: 'Grupo de usuário não encontrado.',
      });
    }

    const doctor = await this.userRepository.findByDocument(document);
    if (doctor) {
      throw new NotFoundError({
        module: 'Doctor',
        code: 'S.CDS.2',
        message: this.entityMessages.getEntityAlreadyRegisteredMessage(
          UserType.DOCTOR,
        ),
      });
    }

    return this.userRepository.create({
      groupId: doctorGroup.id,
      document,
      password: '',
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
      status: UserStatus.MISSING_CONTACT,
    });
  }
}
