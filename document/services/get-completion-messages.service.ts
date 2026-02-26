import { Injectable } from '@nestjs/common';
import { ListProductsDto } from '@/app/product/dtos/list-products.dto';
import { ListProductsService } from '@/app/product/services/list-products.service';
import { ChatCompletionMessageParam } from 'openai/resources';
import { DocumentMimetype } from '../interfaces/document-types.interfaces';

@Injectable()
export class GetCompletionMessagesService {
  constructor(private readonly listProducts: ListProductsService) {}

  async systemAnalyzerMessage(): Promise<ChatCompletionMessageParam> {
    return {
      role: 'system',
      name: 'analyzer-assistant',
      content: `
      Você é um analisador e categorizador de documentos.
      Sua função é analisar o documento recebido e categorizá-lo em um dos tipos definidos.`,
    };
  }

  async systemMedicalDocumentMessage(): Promise<ChatCompletionMessageParam> {
    return {
      role: 'system',
      name: 'medical-document-assistant',
      content: `
        Caso o tipo de documento seja receita médica ou autorização da ANVISA, você deve validar se os dados de saída estarão no formato esperado, tais como:

        authorizationNumber: Número de autorização da ANVISA no formato 123456.12345678/2024. Deve dar match neste Regex: ^\d{6}\.\d{5,20}\/\d{4}(-[0-9A-Z]{2})?$
        doctorName: Deve ser o nome completo do médico sem abreviações em uppercase com prefixo de DR. ou DRA.
        doctorCRM: CRM do médico excepcionalmente no formato CRM/UF (por ex: 12345/SP ou 12345-A/SP). Deve dar match neste Regex: ^\d{2,7}(-[A-Z])?\/[A-Z]{2}$
        manufacturerName: Nome do fabricante do produto sem informações de endereço.
      `,
    };
  }

  async systemProductFetcherMessage(): Promise<ChatCompletionMessageParam> {
    return {
      role: 'system',
      name: 'product-fetcher-assistant',
      content: `Caso o tipo de documento seja receita médica, você deve associar o nome do produto encontrado
      com um dos produtos abaixo:
      
      ${JSON.stringify(await this.getProducts(), null, 2)}`,
    };
  }

  async userDocumentMessage(
    document: Buffer,
    mimetype: string,
  ): Promise<ChatCompletionMessageParam> {
    if (mimetype === DocumentMimetype.PDF) {
      return this.userDocumentPDFMessage();
    }

    return {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimetype};base64,${document.toString('base64')}`,
          },
        },
      ],
    };
  }

  private userDocumentPDFMessage(): ChatCompletionMessageParam {
    return {
      role: 'user',
      content: 'Extraia os dados deste documento PDF.',
    };
  }

  async userExtractedTextMessage(data: string): Promise<ChatCompletionMessageParam> {
    return {
      role: 'user',
      content: `
      Este é um texto processado pelo Amazon Textract, combine com o documento acima para categorizar o tipo de documento:

      ${data}
      
      Caso o documento não se enquadre em nenhum dos tipos definidos, execute a função unknown_document.`,
    };
  }

  async getProducts() {
    const products = await this.listProducts.execute(new ListProductsDto());
    return products.data.map(({ id, name, description }) => ({
      id,
      name,
      description,
    }));
  }
}
