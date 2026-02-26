import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@/common/errors/not-found.error';
import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { IActiveSession } from '@/app/session/interfaces/session.dto';
import { OrderStatus } from '../enums/order.enum';

@Injectable()
export class UpdateOrderStatusService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(session: IActiveSession, id: string, status: string) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.UOSS.01',
        message: 'Pedido não encontrado.',
      });
    } else if (order.status === status) {
      return;
    } else if (
      ![OrderStatus.PENDING, OrderStatus.CREATED].includes(order.status as OrderStatus) ||
      (order.status === OrderStatus.PAID && order.documents.length >= 4)
    ) {
      throw new NotFoundError({
        module: 'Order',
        code: 'S.UOSS.02',
        message: 'Status do pedido não pode ser alterado.',
      });
    }

    return this.orderRepository.update(id, { status, updatedById: session.user.id });
  }
}
