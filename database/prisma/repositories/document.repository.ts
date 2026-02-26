import { Injectable } from '@nestjs/common';
import { PrismaClient, PrismaService } from '../prisma.service';
import { IDocumentRepository } from './interfaces/document.repository.interface';
import { CreateDocumentDto } from '@/app/document/dtos/create-document.dto';
import { ListDocumentsDto } from '@/app/document/dtos/list-documents.dto';
import { UpdateDocumentDto } from '@/app/document/dtos/update-document.dto';
import { PaginationResult } from '@/infra/base/interfaces/pagination.interfaces';
import { documentSelector } from './selectors/document.selectors';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateDocumentDto) {
    return this.prisma.$transaction(async (prisma: PrismaClient) => {
      const documents = await prisma.document.count();
      const number = documents + 1;
      return prisma.document.create({
        data: {
          number: number.toString(),
          ...data,
        },
        select: documentSelector(),
      });
    });
  }

  async list(options: ListDocumentsDto, filters?: Prisma.DocumentWhereInput) {
    const { type, userId, orderId, productId, number } = options;
    const { search, pagination } = options;

    const [records, total, pages] = await this.prisma.document.findManyAndCount({
      ...(options.canFilter() && {
        where: {
          ...filters,
          ...(search
            ? {
                OR: [
                  {
                    number: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    metadata: {
                      string_contains: search,
                      path: ['personCPF'],
                    },
                  },
                  {
                    metadata: {
                      string_contains: search.toLocaleUpperCase(),
                      path: ['personName'],
                    },
                  },
                  {
                    metadata: {
                      string_contains: search.toLocaleUpperCase(),
                      path: ['doctorName'],
                    },
                  },
                  {
                    metadata: {
                      string_contains: search.toLocaleUpperCase(),
                      path: ['patientName'],
                    },
                  },
                ],
              }
            : {
                number,
                type,
                userId,
                orderId,
                ...(productId && {
                  metadata: {
                    path: ['productId'],
                    equals: productId,
                  },
                }),
              }),
        },
        ...(pagination.canPaginate() && pagination.build()),
      }),
      orderBy: {
        createdAt: PrismaService.SortOrder.Desc,
      },
      select: documentSelector(),
    });

    return new PaginationResult(records, {
      totalRecords: total,
      totalPages: pages,
      pageNumber: pagination.page,
      pageSize: pagination.limit,
    });
  }

  async findOne(id: string, filters?: Prisma.DocumentWhereInput) {
    return this.prisma.document.findFirst({
      where: { id, ...filters },
      select: documentSelector(),
    });
  }

  async findOneUnique(id: string, filters?: Prisma.DocumentWhereUniqueInput) {
    return this.prisma.document.findUnique({
      where: { id, ...filters },
      select: documentSelector(),
    });
  }

  async update<T>(id: string, data: UpdateDocumentDto<T>) {
    return this.prisma.document.update({
      where: { id },
      data,
      select: documentSelector(),
    });
  }

  async delete(id: string) {
    await this.prisma.document.delete({
      where: { id },
    });
  }
}
