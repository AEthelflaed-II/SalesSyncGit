import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IPopulateDefaultCommandOptions } from './interfaces';
import { readCsvFile } from '@/common/utils/csv';

interface IProductData {
  name: string;
  description: string;
  sku: string;
  hsCode: string;
  concentration: string;
  price: string;
  active: boolean;
}

@Console()
@Injectable()
export class PopulateProductsCommand {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Command({
    command: 'populate:products',
    description: 'Popula o banco de dados com os produtos',
    alias: 'pp',
  })
  async run(
    { csvFile }: IPopulateDefaultCommandOptions = {
      csvFile: './assets/data/products.csv',
    },
  ) {
    console.info('• Processando os produtos no banco de dados');

    /* Importa os usuários do arquivo CSV */
    const products = await readCsvFile<IProductData>(csvFile);

    console.info('\n%d produtos encontrados', products.length);
    console.info('• %s\n', products.map((product) => product.name).join('\n• '));

    await Promise.all(
      products.map(async (product) => {
        const existingProduct = await this.prisma.product.findFirst({
          where: {
            sku: product.sku,
          },
        });

        if (existingProduct) {
          await this.prisma.product.update({
            where: {
              id: existingProduct.id,
            },
            data: {
              name: product.name,
              description: product.description,
              sku: product.sku,
              hsCode: product.hsCode,
              concentration: product.concentration,
              price: parseFloat(product.price),
              active: product.active,
            },
          });

          return;
        }

        await this.prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            sku: product.sku,
            hsCode: product.hsCode,
            concentration: product.concentration,
            price: parseFloat(product.price),
            active: product.active,
          },
        });
      }),
    );
  }
}
