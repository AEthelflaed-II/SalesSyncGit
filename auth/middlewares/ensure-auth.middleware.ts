import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { InvalidTokenError } from '@/infra/security/errors/invalid-token.error';
import { ExpiredTokenError } from '@/infra/security/errors/expired-token.error';
import { ApplicationError } from '@/common/errors/application.error';
import { HttpExceptionError } from '@/common/errors/http-exception.error';
import { SessionExpiredError } from '@/app/session/errors/session-expired.error';
import { SecurityService } from '@/infra/security/security.service';
import { FindSessionService } from '@/app/session/services/find-session.service';

@Injectable()
export class EnsureAuthMiddleware {
  constructor(
    private readonly security: SecurityService,
    private readonly findSession: FindSessionService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith('Bearer')) {
        throw new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.01',
          message: 'Usuário não autenticado.',
          logout: true,
        });
      }

      const accessToken = authorization.split(' ')[1];
      const session = await this.findSession.byAccessToken(accessToken);
      if (!session) {
        throw new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.02',
          message: 'Sessão inválida.',
          logout: true,
        });
      } else if (!session.user.active) {
        throw new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.03',
          message: 'Usuário desativado.',
          logout: true,
        });
      }

      const { sub, exp } = await this.security.decodeToken(accessToken);
      if (sub !== session.user.id) {
        throw new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.04',
          message: 'Sessão inválida.',
          logout: true,
        });
      } else if (new Date(exp * 1000) < new Date()) {
        throw new SessionExpiredError({
          module: 'Auth',
          code: 'M.EA.05',
          message: 'Sessão expirada.',
          expiredAt: new Date(exp * 1000),
          logout: true,
        });
      }

      req.session = session;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      } else if (error instanceof InvalidTokenError) {
        const err = new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.06',
          message: 'Sessão inválida.',
          logout: true,
        });

        err.addError(error);
        throw err;
      } else if (error instanceof ExpiredTokenError) {
        const err = new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.07',
          message: 'Sessão expirada.',
          logout: true,
        });

        err.addError(error);
        throw err;
      } else if (error instanceof HttpExceptionError) {
        const err = new UnauthorizedError({
          module: 'Auth',
          code: 'M.EA.08',
          message: 'Erro interno.',
        });

        err.addError(error);
        throw err;
      }

      const err = new ApplicationError({
        module: 'Auth',
        code: 'M.EA.09',
        message: 'Erro interno.',
      });

      err.addError(error);
      throw err;
    }
  }
}
