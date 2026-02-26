import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { AsyncAuthorizerCallback } from 'express-basic-auth';

@Injectable()
export class BasichAuthAuthorizer {
  constructor(private readonly config: ConfigService) {}

  async authorize(
    username: string,
    password: string,
    callback: AsyncAuthorizerCallback,
  ) {
    if (
      username === this.config.DOCS_OPERATOR &&
      password === this.config.DOCS_PASSWORD
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  }

  getUnauthorizedResponse() {
    return `
      <html>
        <head>
          <title>Entourage API - Unauthorized</title>
        </head>
        <body>
          <h2 style='font-family:"Arial"; font-weight: bold;'>Oops, parece que há algo de errado.</h2>
          <p style='font-family:"Arial"; color:"#111111"'>Desculpe, você não está autorizado à acessar este recurso.</p>
        </body>
      </html>`;
  }
}
