import { Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotFoundError } from '@/common/errors/not-found.error';
import { ValidationErrorReason } from '@/common/errors/interfaces/errors.interfaces';
import { UserRepository } from '@/infra/database/prisma/repositories/user.repository';
import { StockProductRepository } from '@/infra/database/prisma/repositories/stock-product.repository';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { ConfigService } from '@/config/config.service';
import { PaymentLinkService } from '@/app/payment-link/payment-link.service';
import { CreatePaymentLinkService } from '@/app/payment-link/services/create-payment-link.service';
import { CreateOrderRequestDto } from '@/api/order/dtos/create-order.request.dto';
import { UserType } from '@app/user/enums/user.enum';
import { OrderStatus } from '../enums/order.enum';
import { PaymentLinkStatus } from '@/app/payment-link/enums/payment-link.enum';
import { IActiveSession } from '@app/session/interfaces/session.dto';
import { getUserFullname } from '@/common/utils/formatting';

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly config: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly paymentLinkService: PaymentLinkService,
    private readonly createPaymentLink: CreatePaymentLinkService,
    private readonly stockProductRepository: StockProductRepository,
  ) {}

  async execute(
    session: IActiveSession,
    {
      representativeId,
      customerId,
      doctorId,
      invoice,
      currency,
      amount,
      discount,
      exchangeQuote,
      feeForMerchant,
      installmentMerchant,
      products,
      shipping,
    }: CreateOrderRequestDto,
  ) {
    const representative = await this.userRepository.findOne(representativeId);
    if (!representative) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.COS.01',
        message: 'Representante não encontrado.',
      });
    } else if (representative.group.type !== UserType.REPRESENTATIVE) {
      throw new ApplicationError({
        module: 'Order',
        code: 'S.COS.02',
        message: 'Usuário selecionado não é um representante.',
        details: {
          property: 'representativeId',
          messages: ['Usuário selecionado não é um representante.'],
        } satisfies ValidationErrorReason,
      });
    }

    const customer = await this.userRepository.findOne(customerId);
    if (!customer) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.COS.03',
        message: 'Cliente não encontrado.',
      });
    } else if (customer.group.type !== UserType.CUSTOMER) {
      throw new ApplicationError({
        module: 'Order',
        code: 'S.COS.04',
        message: 'Usuário selecionado não é um cliente.',
        details: {
          property: 'customerId',
          messages: ['Usuário selecionado não é um cliente.'],
        } satisfies ValidationErrorReason,
      });
    }

    const doctor = await this.userRepository.findOne(doctorId);
    if (!doctor) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.COS.05',
        message: 'Médico não encontrado.',
      });
    } else if (doctor.group.type !== UserType.DOCTOR) {
      throw new ApplicationError({
        module: 'Order',
        code: 'S.COS.06',
        message: 'Usuário selecionado não é um médico.',
        details: {
          property: 'doctorId',
          messages: ['Usuário selecionado não é um médico.'],
        } satisfies ValidationErrorReason,
      });
    }

    try {
      await Promise.all(
        products.map(async (product, i) => {
          const productEntity = await this.stockProductRepository.findOne(
            product.stockProductId,
          );

          if (!productEntity) {
            throw new NotFoundError({
              module: 'Order',
              code: 'S.COS.07',
              message: 'Produto não encontrado.',
              details: {
                property: `products.${i}.stockProductId`,
                messages: ['Produto não encontrado.'],
              } satisfies ValidationErrorReason,
            });
          }
        }),
      );
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError({
        module: 'Order',
        code: 'S.COS.08',
        message: 'Erro ao buscar produtos.',
        details: {
          property: 'products',
          messages: ['Erro ao buscar produtos.'],
        } satisfies ValidationErrorReason,
        errors: [error],
      });
    }

    const amountProducts = products.reduce((total, product) => {
      const finalPrice = product.price - (product.price * product.discount) / 100;
      return total + finalPrice * product.quantity;
    }, 0);

    const totalAmount = (amount || amountProducts) + (shipping.price || 0);

    const order = await this.orderRepository.create({
      status: OrderStatus.PENDING,
      invoice,
      currency,
      amount: totalAmount,
      discount,
      shipping,
      products,
      createdById: session.user.id,
      representative: {
        code: representative.document,
        name: getUserFullname(
          representative.profile.firstName,
          representative.profile.lastName,
        ),
        userId: representative.id,
      },
      customer: {
        document: customer.document,
        name: getUserFullname(customer.profile.firstName, customer.profile.lastName),
        userId: customer.id,
      },
      doctor: {
        crm: doctor.document,
        name: getUserFullname(doctor.profile.firstName, doctor.profile.lastName),
        userId: doctor.id,
      },
    });

    try {
      await this.createPaymentLink.execute({
        status: PaymentLinkStatus.CREATED,
        exchangeQuote,
        orderId: order.id,
        currency,
        amount: totalAmount,
        feeForMerchant,
        ...(feeForMerchant && {
          installmentMerchant,
        }),
        expiresAt: new Date(
          new Date().getTime() +
            this.config.PAYMENT_LINK_EXPIRATION_HOURS * 60 * 60 * 1000,
        ),
      });

      await Promise.all(
        order.products.map(async (product) => {
          await this.stockProductRepository.decreaseInStock(
            ((product as any)?.stockProduct as any)?.id,
            product.quantity,
          );
        }),
      );

      const { links, ...data } = await this.orderRepository.findOne(order.id, {
        links: true,
      });

      return {
        ...data,
        links: links.map((link) => ({
          ...link,
          paymentUrl: this.paymentLinkService.getPaymentLinkUrl(link.id),
        })),
      };
    } catch (error) {
      console.error(error);
      await this.orderRepository.delete(order.id);
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError({
        module: 'Order',
        code: 'S.COS.09',
        message: 'Erro ao criar pagamento.',
        errors: [error],
      });
    }
  }
}
