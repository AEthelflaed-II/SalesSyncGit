import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { SecurityService } from '@/infra/security/security.service';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@Injectable()
export class TestingService {
  constructor(
    private readonly security: SecurityService,
    private readonly prisma: PrismaService,
  ) {}

  async generateDocument() {
    return faker.helpers.arrayElement([cpf.generate, cnpj.generate])();
  }

  async createUserAndReturnLoginDetails() {
    const password = faker.internet.password();
    const user = await this.prisma.user.create({
      data: {
        document: await this.generateDocument(),
        password: await this.security.hashPassword(password),
        group: {
          connect: await this.getRandomGroup(),
        },
        profile: {
          create: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
          },
        },
      },
    });

    return {
      document: user.document,
      password,
    };
  }

  async getLastUser(filters?: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where: filters,
      orderBy: { createdAt: PrismaService.SortOrder.Desc },
    });
  }

  async getRandomGroup() {
    const groups = await this.prisma.userGroup.findMany();
    return faker.helpers.arrayElement(groups);
  }
}
