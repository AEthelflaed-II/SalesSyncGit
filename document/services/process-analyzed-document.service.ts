import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { AnalyzeDocumentResponse, Block } from '@aws-sdk/client-textract';

@Injectable()
export class ProcessAnalyzeDocumentService {
  execute({ Blocks }: AnalyzeDocumentResponse): Record<string, string> {
    if (!Blocks) {
      throw new ApplicationError({
        module: 'Document',
        code: 'S.PDS.01',
        message: 'Erro ao processar o documento.',
        errors: [new Error('Nenhum bloco encontrado.')],
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const keyMap: Record<string, Block> = {};
    const valueMap: Record<string, Block> = {};
    const blockMap: Record<string, Block> = {};

    Blocks.forEach((block) => {
      blockMap[block.Id] = block;
      if (block.BlockType === 'KEY_VALUE_SET') {
        if (block.EntityTypes?.includes('KEY')) {
          keyMap[block.Id] = block;
        } else if (block.EntityTypes?.includes('VALUE')) {
          valueMap[block.Id] = block;
        }
      }
    });

    const keyValuePairs: Record<string, string> = {};
    Object.values(keyMap).forEach((keyBlock) => {
      if (keyBlock.Relationships) {
        keyBlock.Relationships.forEach((relationship) => {
          if (relationship.Type === 'VALUE') {
            relationship.Ids.forEach((valueId) => {
              const valueBlock = valueMap[valueId];
              if (valueBlock) {
                const keyText = this.getText(keyBlock, blockMap);
                const valueText = this.getText(valueBlock, blockMap);
                if (keyText) {
                  keyValuePairs[keyText] = valueText;
                }
              }
            });
          }
        });
      }
    });

    return keyValuePairs;
  }

  private getText(block: Block, blockMap: Record<string, Block>): string {
    if (!block.Relationships) return '';
    let text = '';

    block.Relationships.forEach((relationship) => {
      if (relationship.Type === 'CHILD') {
        relationship.Ids.forEach((childId) => {
          const wordBlock = blockMap[childId];
          if (
            wordBlock?.BlockType === 'WORD' ||
            wordBlock?.BlockType === 'LINE'
          ) {
            text += wordBlock.Text + ' ';
          }
        });
      }
    });

    return text.trim();
  }
}
