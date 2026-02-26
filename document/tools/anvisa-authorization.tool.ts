import { ChatCompletionTool } from 'openai/resources';

export function anvisaAuthorizationTool(): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'anvisa_authorization',
      description: 'Extrai as informações de autorização da ANVISA.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: [
          'authorizationNumber',
          'expirationDate',
          'personName',
          'personCPF',
          'doctorName',
          'doctorCRM',
          'productType',
          'manufacturerName',
          'manufacturerCNPJ',
        ],
        properties: {
          authorizationNumber: {
            type: 'string',
            description: 'Número da autorização.',
          },
          expirationDate: {
            type: 'string',
            description:
              'Data de validade da autorização no formato ISO GMT-3 por ex: 2024-11-25T00:00:00.000-03:00',
          },
          personName: {
            type: 'string',
            description: 'Nome do titular da autorização.',
          },
          personCPF: {
            type: 'string',
            description: 'CPF do titular da autorização (apenas números).',
          },
          legalGuardianName: {
            type: 'string',
            description: 'Nome do responsável legal do titular.',
          },
          legalGuardianCPF: {
            type: 'string',
            description:
              'CPF do responsável legal do titular (apenas números).',
          },
          doctorName: {
            type: 'string',
            description:
              'Nome do médico ou médica em uppercase com prefixo de DR. se for homem ou DRA. se for mulher.',
          },
          doctorCRM: {
            type: 'string',
            description:
              'CRM do médico excepcionalmente no formato CRM/UF (por ex: 12345/SP ou 12345-A/SP).',
          },
          productType: {
            type: 'string',
            description: 'Nome do produto autorizado.',
          },
          manufacturerName: {
            type: 'string',
            description: 'Apenas a razão social do fabricante.',
          },
          manufacturerCNPJ: {
            type: 'string',
            description:
              'CNPJ do fabricante, se não houver retornar "Não informado".',
          },
        },
      },
    },
  };
}
