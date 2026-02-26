import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI = new OpenAI({
    apiKey: this.config.OPENAI_API_KEY,
  });
  constructor(private readonly config: ConfigService) {}
  async chatCompletions(messages: OpenAI.ChatCompletionCreateParamsNonStreaming) {
    return this.openai.chat.completions.create(messages);
  }
}
