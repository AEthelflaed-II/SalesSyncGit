import { Injectable } from '@nestjs/common';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { SessionExpiredError } from '@/app/session/errors/session-expired.error';
import { SecurityService } from '@/infra/security/security.service';
import { FindSessionService } from '@/app/session/services/find-session.service';
import { CreateSessionService } from '@/app/session/services/create-session.service';
import { DeleteSessionService } from '@/app/session/services/delete-session.service';
import { AuthRefreshDto } from '../interfaces/auth.interfaces';

@Injectable()
export class AuthRefreshService {
  constructor(
    private readonly security: SecurityService,
    private readonly findSession: FindSessionService,
    private readonly createSession: CreateSessionService,
    private readonly deleteSession: DeleteSessionService,
  ) {}

  async execute(data: AuthRefreshDto) {
    const session = await this.findSession.byRefreshToken(data.refreshToken);
    if (!session) {
      throw new UnauthorizedError({
        module: 'Auth',
        code: 'S.ARS.01',
        message: 'Sessão inválida.',
        logout: true,
      });
    }

    const { exp, sub } = await this.security.decodeRefreshToken(data.refreshToken);

    if (sub !== session.user.id) {
      throw new UnauthorizedError({
        module: 'Auth',
        code: 'S.ARS.02',
        message: 'Sessão inválida.',
        logout: true,
      });
    } else if (!session.user.active) {
      throw new UnauthorizedError({
        module: 'Auth',
        code: 'S.ARS.03',
        message: 'Usuário desativado.',
        logout: true,
      });
    } else if (new Date(exp * 1000) < new Date()) {
      throw new SessionExpiredError({
        module: 'Auth',
        code: 'S.ARS.04',
        message: 'Sessão expirada.',
        expiredAt: new Date(exp * 1000),
        logout: true,
      });
    }

    const { accessToken, expiresAt } = await this.security.generateAccessToken(
      session.user,
    );

    const { refreshToken } = await this.security.generateRefreshToken(accessToken);

    await this.deleteSession.execute(session.id);
    const newSession = await this.createSession.execute({
      document: session.user.document,
      accessToken,
      refreshToken,
      expiresAt,
    });

    return newSession;
  }
}
