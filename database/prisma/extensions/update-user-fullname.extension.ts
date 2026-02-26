import { Prisma } from '@prisma/client';
import { getUserFullname } from '@/common/utils/formatting';

export const updateUserFullNameExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'updateUserFullName',
    query: {
      user: {
        async create({ operation, args, query }) {
          if (operation === 'create') {
            args.data.profile.create.fullName = getUserFullname(
              args?.data?.profile?.create?.firstName,
              args?.data?.profile?.create?.lastName,
            );
          }

          return query(args);
        },
        async update({ operation, args, query }) {
          if (operation === 'update') {
            const user = await client.user.findUnique({
              where: args.where,
              include: { profile: true },
            });

            args.data.profile.update.fullName = getUserFullname(
              (args?.data?.profile?.update?.firstName as string) ||
                user.profile.firstName,
              (args?.data?.profile?.update?.lastName as string) ||
                user.profile.lastName,
            );
          }

          return query(args);
        },
      },
    },
  });
});
