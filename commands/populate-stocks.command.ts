import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IPopulateDefaultCommandOptions } from './interfaces';
import { readCsvFile } from '@/common/utils/csv';

interface IStockData {
  name: string;
  code: number;
}

@Console()
@Injectable()
export class PopulateStocksCommand {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Command({
    command: 'populate:stocks',
    description: 'Popula o banco de dados com os estoques',
    alias: 'pstk',
  })
  async run(
    { csvFile }: IPopulateDefaultCommandOptions = {
      csvFile: './assets/data/stocks.csv',
    },
  ) {
    console.info('• Processando os estoques no banco de dados');

    /* Importa os estoques do arquivo CSV */
    const stocks = await readCsvFile<IStockData>(csvFile);

    console.info('\n%d estoques encontrados', stocks.length);
    console.info('• %s\n', stocks.map((stock) => stock.name).join('\n• '));

    await Promise.all(
      stocks.map(async (stock) => {
        const existingStock = await this.prisma.stock.findFirst({
          where: {
            code: +stock.code,
          },
        });

        if (existingStock) {
          await this.prisma.stock.update({
            where: {
              id: existingStock.id,
            },
            data: {
              name: stock.name,
              code: +stock.code,
            },
          });

          return;
        }

        await this.prisma.stock.create({
          data: {
            name: stock.name,
            code: +stock.code,
          },
        });
      }),
    );

    try {
      const products = await this.prisma.product.findMany();
      const stocks = await this.prisma.stock.findMany({
        select: {
          id: true,
          code: true,
          products: {
            select: {
              id: true,
              productId: true,
            },
          },
        },
      });

      await Promise.all(
        stocks.map(async (stock) => {
          return Promise.all(
            products.map(async (product) => {
              const existingStockProduct = await this.prisma.stockProduct.findFirst({
                where: {
                  stockId: stock.id,
                  productId: product.id,
                },
              });

              if (existingStockProduct) {
                return;
              }

              await this.prisma.stockProduct.create({
                data: {
                  stockId: stock.id,
                  productId: product.id,
                  quantity: 0,
                },
              });
            }),
          );
        }),
      );
    } catch (error) {
      console.error('Erro ao listar os produtos e estoques:', error);
    }
  }
}
