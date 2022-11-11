import { CacheModule, Module } from '@nestjs/common';
import { TelegramBotUpdate } from './telegram-bot.update';
import { RegistrationForEventScene } from './scenes/registration-for-event.scene';
import { ConfigModule } from '../config/config.module';

@Module({
  providers: [TelegramBotUpdate, RegistrationForEventScene],
  imports: [CacheModule.register(), ConfigModule],
})
export class TelegramBotModule {}
