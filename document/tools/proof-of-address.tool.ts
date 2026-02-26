import { ChatCompletionTool } from 'openai/resources';

export function proofOfAddressTool(): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'proof_of_address',
      description:
        'Extrai as informações de comprovante de endereço tais como: contas de luz, água, telefone, internet e qualquer documento oficial que comprove o endereço.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['personName'],
        properties: {
          personName: {
            type: 'string',
            description: 'Nome completo do cidadão em uppercase.',
          },
          address: {
            type: 'object',
            additionalProperties: false,
            required: [
              'number',
              'street',
              'neighborhood',
              'city',
              'state',
              'postalCode',
            ],
            properties: {
              street: {
                type: 'string',
                description: 'Nome da rua.',
              },
              number: {
                type: 'string',
                description: 'Número da residência.',
              },
              complement: {
                type: 'string',
                description: 'Complemento do endereço se houver.',
              },
              neighborhood: {
                type: 'string',
                description: 'Nome do bairro.',
              },
              city: {
                type: 'string',
                description: 'Nome da cidade.',
              },
              state: {
                type: 'string',
                description: 'Nome do estado (por exemplo SP).',
              },
              postalCode: {
                type: 'string',
                description: 'CEP (apenas números).',
              },
            },
          },
        },
      },
    },
  };
}
