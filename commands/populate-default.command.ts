import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ConfigService } from '@/config/config.service';
import { SecurityService } from '@/infra/security/security.service';
import { readCsvFile } from '@/common/utils/csv';
import { PopulateStocksCommand } from './populate-stocks.command';
import { PopulateProductsCommand } from './populate-products.command';
import { PopulateUserGroupsCommand } from './populate-user-groups.command';
import { IPopulateDefaultCommandOptions } from './interfaces';
import { getUserFullname } from '@/common/utils/formatting';
import { UserType } from '@/app/user/enums/user.enum';

interface IUserData {
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  password: string;
  group: string;
  active: boolean;
}

@Console()
@Injectable()
export class PopulateDefaultCommand {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly security: SecurityService,
    private readonly populateStocks: PopulateStocksCommand,
    private readonly populateProducts: PopulateProductsCommand,
    private readonly populateUserGroups: PopulateUserGroupsCommand,
  ) {}

  @Command({
    command: 'populate',
    description: 'Popula o banco de dados com dados padrões',
    alias: 'pop',
    options: [
      {
        flags: '-c, --csv-file <path>',
        description: 'Localização do arquivo CSV com os dados dos usuários',
      },
    ],
  })
  async run({ csvFile = './assets/data/users.csv' }: IPopulateDefaultCommandOptions) {
    /* Popula os produtos */
    await this.populateProducts.run();

    /* Popula os estoques */
    await this.populateStocks.run();

    /* Popula os grupos de usuários */
    await this.populateUserGroups.run();

    /* Importa os usuários do arquivo CSV */
    const users = await readCsvFile<IUserData>(csvFile);

    console.info('\n%d usuários encontrados', users.length);
    console.info(
      '• %s\n',
      users.map((user) => getUserFullname(user.firstName, user.lastName)).join('\n• '),
    );

    /* Cria ou atualiza os usuários */
    await Promise.all(
      users.map(async (user) => {
        const existingUser = await this.prisma.user.findUnique({
          where: {
            document: user.document,
          },
        });

        if (existingUser) {
          const userUpdated = await this.prisma.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              document: user.document,
              password: await this.security.hashPassword(user.password),
              profile: {
                update: {
                  email: user.email || undefined,
                  firstName: user.firstName,
                  lastName: user.lastName,
                },
              },
            },
          });

          console.info('• usuário %s foi atualizado', existingUser.document);
          return userUpdated;
        }

        const group = await this.prisma.userGroup.findFirst({
          where: {
            type: user.group,
          },
        });

        if (!group) {
          console.error('• grupo %s não encontrado', user.group);
          return;
        }

        const userCreated = await this.prisma.user.create({
          data: {
            document: user.document,
            password: await this.security.hashPassword(user.password),
            active: user.active,
            group: {
              connect: {
                id: group.id,
              },
            },
            profile: {
              create: {
                email: user.email || undefined,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            },
          },
        });

        console.info('• usuário %s foi criado', user.document);
        return userCreated;
      }),
    );

    /* Busca o representante */
    const representative = await this.prisma.user.findFirst({
      where: {
        group: {
          type: UserType.REPRESENTATIVE,
        },
      },
    });

    /* Atualiza o representante dos usuários */
    await this.prisma.user.updateMany({
      where: {
        group: {
          type: {
            in: [UserType.CUSTOMER, UserType.DOCTOR],
          },
        },
      },
      data: {
        representativeId: representative?.id,
      },
    });

    console.info('\n• Operação realizada com sucesso.');
  }
}
