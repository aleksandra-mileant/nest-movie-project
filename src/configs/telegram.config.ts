import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = async (
  configService: ConfigService,
): Promise<ITelegramOptions> => {
  const token = configService.get<string>('TELEGRAM_TOKEN');
  const chatId = configService.get<string>('CHAT_ID');

  if (!token) {
    throw new Error('No TELEGRAM_TOKEN');
  }

  if (!chatId) {
    throw new Error('No CHAT_ID');
  }

  return {
    token,
    chatId,
  };
};
