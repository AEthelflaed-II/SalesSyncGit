import { ChatCompletionTool } from 'openai/resources';

export function powerOfAttorneyTool(): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'power_of_attorney',
      description:
        'Extrai as informações de procuração ou comprovante de vínculo.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['signatureDate', 'expirationDate', 'grantor', 'attorney'],
        properties: {
          signatureDate: {
            type: 'string',
            description: 'Data da assinatura da procuração.',
          },
          expirationDate: {
            type: 'string',
            description:
              'Data de validade da procuração (se houver) no formato ISO GMT-3 por ex: 2024-11-25T00:00:00.000-03:00.',
          },
          grantor: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'cpf', 'phone', 'address'],
            properties: {
              name: {
                type: 'string',
                description: 'Nome do outorgante em uppercase.',
              },
              cpf: {
                type: 'string',
                description: 'CPF do outorgante (apenas números).',
              },
              phone: {
                type: 'string',
                description:
                  'Telefone do outorgante no formato (00) 00000-0000.',
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
          attorney: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'cpf', 'phone', 'address'],
            properties: {
              name: {
                type: 'string',
                description: 'Nome do outorgado em uppercase.',
              },
              cpf: {
                type: 'string',
                description: 'CPF do outorgado (apenas números).',
              },
              phone: {
                type: 'string',
                description:
                  'Telefone do outorgado no formato (00) 00000-0000.',
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
      },
    },
  };
}
