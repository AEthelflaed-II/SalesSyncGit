import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ActiveSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IActiveSession => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
