import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/database.module';
import { SecurityModule } from '@infra/security/security.module';
import { ScheduleModule } from './infra/schedule/schedule.module';
import { ConfigModule } from '@config/config.module';
import { EmailModule } from './infra/email/email.module';
import { TemplateModule } from './app/template/template.module';
import { AuthModule } from '@app/auth/auth.module';
import { DocsModule } from '@app/docs/docs-module';
import { PDFModule } from './shared/lib/pdf/pdf.module';
import { UserModule } from '@app/user/user.module';
import { UserGroupModule } from '@app/user-group/user-group.module';
import { DoctorModule } from './app/doctor/doctor.module';
import { MedicalSpecialtyModule } from './app/medical-specialty/medical-specialty.module';
import { SessionModule } from '@app/session/session.module';
import { ProductModule } from '@app/product/product.module';
import { StockModule } from './app/stock/stock.module';
import { StockProductModule } from './app/stock-product/stock-product.module';
import { OrderModule } from '@app/order/order.module';
import { PaymentModule } from './app/payment/payment.module';
import { PaymentLinkModule } from './app/payment-link/payment-link.module';
import { DocumentModule } from './app/document/document.module';
import { AmazonModule } from './infra/integration/amazon/amazon.module';
import { TristarModule } from './infra/integration/tristar/tristar.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    SecurityModule,
    ConfigModule,
    EmailModule,
    ScheduleModule,
    TemplateModule,
    DocsModule,
    PDFModule,
    AuthModule,
    UserModule,
    UserGroupModule,
    DoctorModule,
    MedicalSpecialtyModule,
    SessionModule,
    ProductModule,
    StockModule,
    StockProductModule,
    OrderModule,
    PaymentModule,
    PaymentLinkModule,
    DocumentModule,
    AmazonModule,
    TristarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
