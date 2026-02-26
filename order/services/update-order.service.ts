import { Injectable, Logger } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { NotFoundError } from '@/common/errors/not-found.error';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderStatus } from '../enums/order.enum';
import { PromiseReturnType } from '@/infra/types';

@Injectable()
export class UpdateOrderService {
  private readonly logger = new Logger(UpdateOrderService.name);
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, data: UpdateOrderDto): Promise<void> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.UOS.01',
        message: 'Pedido não encontrado.',
      });
    }

    await this.validate(order, data);
    await this.orderRepository.update(id, data);
  }

  async validate(
    current: PromiseReturnType<OrderRepository['findOne']>,
    order: UpdateOrderDto,
  ): Promise<void> {
    if (
      ![OrderStatus.PENDING, OrderStatus.CREATED].includes(
        current.status as OrderStatus,
      ) ||
      (current.status === OrderStatus.PAID && current.documents.length >= 4)
    ) {
      throw new ApplicationError({
        module: 'Order',
        code: 'S.UOS.02',
        message: 'Pedido não pode ser atualizado.',
      });
    } else if (
      order.status &&
      order.status !== current.status &&
      order.status !== OrderStatus.CONFIRMED
    ) {
      throw new ApplicationError({
        module: 'Order',
        code: 'S.UOS.03',
        message: 'Status do pedido não pode ser alterado.',
      });
    }
  }
}
