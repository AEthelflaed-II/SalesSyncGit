import { ChatCompletionTool } from 'openai/resources';

export function identityTool(): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'identity',
      description: 'Extrai as informações de carteira de identidade, CNH ou passaporte.',
      parameters: {
        type: 'object',
        required: ['personName', 'personCPF', 'birthDate'],
        additionalProperties: false,
        properties: {
          personName: {
            type: 'string',
            description: 'Nome completo do cidadão em uppercase.',
          },
          personCPF: {
            type: 'string',
            description: 'Número do CPF (apenas números com 11 dígitos).',
          },
          birthDate: {
            type: 'string',
            description:
              'Data de nascimento do cidadão no formato ISO GMT-3 por ex: 2024-11-25T00:00:00.000-03:00.',
          },
          affiliation: {
            type: 'object',
            description:
              'Informações de filiação do cidadão se for carteira de identidade.',
            required: ['motherName'],
            additionalProperties: false,
            properties: {
              motherName: {
                type: 'string',
                description: 'Nome completo da mãe do cidadão em uppercase.',
              },
              fatherName: {
                type: 'string',
                description: 'Nome completo do pai do cidadão em uppercase.',
              },
            },
          },
        },
      },
    },
  };
}
