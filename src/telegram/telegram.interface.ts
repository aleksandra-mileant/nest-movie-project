// Почему интерфейс а не класс - потому что нам не нужны декораторы и дополнительные методы

export interface ITelegramOptions {
  chatId: string;
  token: string;
}

export interface ITelegramModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions;
}
