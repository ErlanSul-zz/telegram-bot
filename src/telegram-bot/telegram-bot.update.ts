import { Start, Update, Command, Context } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { EVENT_SCENE_ID } from './constants/scenes.constants';

@Update()
export class TelegramBotUpdate {
  @Start()
  start(ctx: Scenes.SceneContext) {
    ctx.scene.enter(EVENT_SCENE_ID);
  }

  @Command('reset')
  async reset(@Context() ctx: Scenes.WizardContext) {
    ctx.scene.leave();
    ctx.scene.enter(EVENT_SCENE_ID);
  }
}
