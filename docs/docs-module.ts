import { Module } from '@nestjs/common';
import { BasichAuthAuthorizer } from './basic-auth.authorizer';

@Module({
  providers: [BasichAuthAuthorizer],
})
export class DocsModule {}
