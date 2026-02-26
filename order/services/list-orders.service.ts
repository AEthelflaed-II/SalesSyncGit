import { OrderRepository } from '@/infra/database/prisma/repositories/order.repository';
import { Injectable } from '@nestjs/common';
import { ListOrdersDto } from '../dtos/list-orders.dto';

@Injectable()
export class ListOrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(options: ListOrdersDto) {
    return this.orderRepository.list(options);
  }
}
