import { ChatCompletionTool } from 'openai/resources';

export function unknownDocumentTool(): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'unknown_document',
      description: `
      Retorna uma mensagem para documentos desconhecidos.
      Os documentos desconhecidos são aqueles que não se enquadram em nenhum dos tipos abaixo:
      - Identidade (Carteira de identidade, CNH ou passaporte)
      - Receita médica
      - Comprovante de endereço (Conta de luz, água, telefone, etc)
      - Autorização da ANVISA
      - Procuração ou comprovante de vínculo
      `,
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['message'],
        properties: {
          message: {
            type: 'string',
            description: 'Mensagem de documento desconhecido.',
          },
        },
      },
    },
  };
}
