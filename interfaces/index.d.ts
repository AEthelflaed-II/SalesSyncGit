import type { SessionResponseDto } from '@/app/session/interfaces/session-response.dto';
import 'multer';

declare global {
  namespace Express {
    export interface Request {
      session: SessionResponseDto;
    }
  }

  interface String {
    toCapitalized(): string;
  }
}
