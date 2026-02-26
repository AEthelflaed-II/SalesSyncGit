import { ChatCompletionTool } from 'openai/resources';

export function medicalPrescriptionTool(): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'medical_prescription',
      description:
        'Extrai as informações de receita médica. CRM do médico no formato CRM/UF (por ex: 12345/SP ou 12345-A/SP).',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['doctorName', 'doctorCRM', 'patientName'],
        properties: {
          prescriptionDate: {
            type: 'string',
            description:
              'Data da prescrição no formato ISO GMT-3 por ex: 2024-11-25T00:00:00.000-03:00, se não houver retornar null.',
          },
          doctorName: {
            type: 'string',
            description:
              'Nome do médico ou médica em uppercase com prefixo de DR. ou DRA.',
          },
          doctorCRM: {
            type: 'string',
            description:
              'Número do CRM do médico e estado (sem caracteres especiais exceto "/").',
          },
          patientName: {
            type: 'string',
            description: 'Nome do paciente em uppercase.',
          },
          productId: {
            type: 'string',
            description: 'ID do produto associado.',
          },
          productName: {
            type: 'string',
            description: 'Nome do produto associado.',
          },
        },
      },
    },
  };
}
