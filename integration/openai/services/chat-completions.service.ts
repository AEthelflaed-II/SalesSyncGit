import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import OpenAI from 'openai';

@Injectable()
export class ChatCompletionsService {
  constructor(private readonly openai: OpenAIService) {}

  async execute(messages: OpenAI.ChatCompletionCreateParamsNonStreaming) {
    return this.openai.chatCompletions(messages);
  }
}
