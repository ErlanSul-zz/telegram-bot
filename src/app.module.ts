import { Module } from '@nestjs/common';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { ConfigService } from './config/config.service';

export const configService = new ConfigService('conf-local.env');

@Module({
  imports: [
    TelegramBotModule,
    TelegrafModule.forRoot({
      token: configService.telegramToken,
      middlewares: [session()],
    }),
  ],
})
export class AppModule {}
