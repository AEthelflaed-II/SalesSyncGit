import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Console()
@Injectable()
export class PopulateUserGroupsCommand {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Command({
    command: 'populate:groups',
    description: 'Popula o banco de dados com os grupos de usuário padrão',
    alias: 'pg',
  })
  async run() {
    console.info('• Processando grupos de usuários padrão no banco de dados');

    const groupMap = {
      admin: 'Administrador',
      employee: 'Funcionário',
      representative: 'Representante',
      customer: 'Cliente',
      doctor: 'Médico',
    };

    /* Criar os grupos de usuários */
    await Promise.all(
      Object.keys(groupMap).map(async (key) => {
        const existingGroup = await this.prisma.userGroup.findFirst({
          where: {
            type: key,
          },
        });

        if (existingGroup) {
          await this.prisma.userGroup.update({
            where: {
              id: existingGroup.id,
            },
            data: {
              name: groupMap[key],
            },
          });

          return;
        }

        await this.prisma.userGroup.create({
          data: {
            type: key,
            name: groupMap[key],
            active: true,
          },
        });
      }),
    );
  }
}
