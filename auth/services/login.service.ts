import { Injectable } from '@nestjs/common';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { SecurityService } from '@/infra/security/security.service';
import { CreateSessionService } from '@/app/session/services/create-session.service';
import { FindSessionService } from '@/app/session/services/find-session.service';
import { DeleteSessionService } from '@/app/session/services/delete-session.service';
import { CreateSessionDto } from '@/app/session/interfaces/create-session.dto';
import { FindUserService } from '@/app/user/services/find-user.service';
import { NotFoundError } from '@/common/errors/not-found.error';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly security: SecurityService,
    private readonly findUser: FindUserService,
    private readonly findSession: FindSessionService,
    private readonly createSession: CreateSessionService,
    private readonly deleteSession: DeleteSessionService,
  ) {}

  async execute({ document, password }: CreateSessionDto) {
    try {
      const user = await this.findUser.byDocument(
        document,
        { removedAt: null },
        { withPassword: true },
      );

      if (!user) {
        throw new BadRequestError({
          module: 'Auth',
          code: 'S.ALS.01',
          message: 'Usuário ou senha inválidos.',
        });
      } else if (!user.active) {
        throw new UnauthorizedError({
          module: 'Auth',
          code: 'S.ALS.02',
          message: 'Usuário desativado.',
        });
      } else if (!user.password) {
        throw new BadRequestError({
          module: 'Auth',
          code: 'S.ALS.03',
          message:
            'Usuário sem acesso ao sistema. Entre em contato com nossa equipe para solicitá-lo.',
        });
      }

      const session = await this.findSession.byUserDocument(document);
      if (session) {
        await this.deleteSession.execute(session.id);
      }

      const isValidPassword = await this.security.comparePassword(
        password,
        user.password,
      );

      if (!isValidPassword) {
        throw new BadRequestError({
          module: 'Auth',
          code: 'S.ALS.03',
          message: 'Usuário ou senha inválidos.',
        });
      }

      const { accessToken, expiresAt } = await this.security.generateAccessToken(user);

      const { refreshToken } = await this.security.generateRefreshToken(accessToken);

      return this.createSession.execute({
        document,
        password,
        expiresAt,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new BadRequestError({
          module: 'Auth',
          code: 'S.ALS.04',
          message: 'Usuário ou senha inválidos.',
        });
      }

      throw error;
    }
  }
}
