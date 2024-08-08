import { Inject, Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @Inject(TELEGRAM_MODULE_OPTIONS) private readonly options: ITelegramOptions,
  ) {
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(message: string, chatId: string = this.options.chatId) {
    this.logger.log(`Sending message to chatId: ${chatId} - Message: ${message}`);
    await this.bot.telegram.sendMessage(chatId, message)
      .catch(error => {
        this.logger.error(`Failed to send message: ${error.message}`);
        throw error;
      });
  }
}
