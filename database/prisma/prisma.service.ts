import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient as DefaultPrismaClient } from '@prisma/client';
import { ConfigService } from '@/config/config.service';

/** Extensions **/
import { findManyAndCountExtension } from './extensions/find-many-and-count.extension';
import { updateUserFullNameExtension } from './extensions/update-user-fullname.extension';

type PrismaClientOptions = Prisma.Subset<
  Prisma.PrismaClientOptions,
  Prisma.PrismaClientOptions
>;

function prismaClientFactory() {
  const client = (args?: PrismaClientOptions) =>
    new DefaultPrismaClient(args)
      .$extends(findManyAndCountExtension)
      .$extends(updateUserFullNameExtension);

  return class {
    constructor(args: PrismaClientOptions) {
      return client(args);
    }
  } as new (args?: PrismaClientOptions) => ReturnType<typeof client>;
}

export type PrismaClient = InstanceType<ReturnType<typeof prismaClientFactory>>;

@Injectable()
export class PrismaService extends prismaClientFactory() implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  static SortOrder = {
    Asc: Prisma.SortOrder.asc,
    Desc: Prisma.SortOrder.desc,
  };
}
