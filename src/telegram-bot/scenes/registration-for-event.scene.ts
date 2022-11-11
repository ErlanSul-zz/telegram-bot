import {
  Action,
  Command,
  Context,
  On,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { EVENTS, TITLE } from '../constants/enum.constants';
import { Scenes } from 'telegraf';
import { UsersInterface } from '../interfaces/users.interface';
import {
  getArrayForCallbackQuery,
  getArrayForText,
  removeUserFromArray,
} from '../../global.helpers';
import { EVENT_SCENE_ID } from '../constants/scenes.constants';

@Wizard(EVENT_SCENE_ID)
export class RegistrationForEventScene {
  private users: Partial<UsersInterface>[];

  constructor() {
    this.users = [];
  }

  @Command('reset')
  async reset(@Context() ctx: Scenes.WizardContext) {
    ctx.reply(
      'Вы сбросили регистрацию\nНажмите на /start что бы начать заново',
    );
    this.users = removeUserFromArray(this.users, ctx);
    ctx.scene.leave();
  }

  @WizardStep(1)
  async pickEvent(@Context() ctx: Scenes.WizardContext): Promise<void> {
    const checkUser = this.users.find(
      (user) => user.chatId === ctx.message.from['id'],
    );

    if (checkUser === undefined) {
      this.users.push({ chatId: ctx.message.from['id'] });
    }
    ctx.reply(`${TITLE.SELECT_EVENT}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: EVENTS.EGOR, callback_data: EVENTS.EGOR }],
          [{ text: EVENTS.MORGENSTERN, callback_data: EVENTS.MORGENSTERN }],
          [{ text: EVENTS.HOME, callback_data: EVENTS.HOME }],
        ],
      },
    });

    ctx.wizard.next();
  }

  @Action([EVENTS.EGOR, EVENTS.MORGENSTERN, EVENTS.HOME])
  @WizardStep(2)
  async getEvent(@Context() ctx: Scenes.WizardContext) {
    this.users = getArrayForCallbackQuery(this.users, 'event', ctx);
    await ctx.answerCbQuery();
    ctx.reply(TITLE.LAST_NAME);
    ctx.wizard.next();
  }

  @On('text')
  @WizardStep(3)
  async lustName(@Context() ctx: Scenes.WizardContext): Promise<void> {
    this.users = getArrayForText(this.users, 'lastName', ctx);
    ctx.reply(TITLE.FIRST_NAME);
    ctx.wizard.next();
  }

  @On('text')
  @WizardStep(4)
  async firstName(@Context() ctx: Scenes.WizardContext): Promise<void> {
    this.users = getArrayForText(this.users, 'firstName', ctx);
    ctx.reply(TITLE.PASSPORT);
    ctx.wizard.next();
  }

  @On(['document', 'photo'])
  @WizardStep(5)
  async passport(@Context() ctx: Scenes.WizardContext): Promise<void> {
    this.users = await Promise.all(
      this.users.map(async (user) => {
        if (user.chatId === ctx.message.from['id']) {
          const document = ctx.message['document'];
          const photo = ctx.message['photo'];

          if (document !== undefined) {
            const urlDocument = await ctx.telegram.getFileLink(
              document.file_id,
            );
            user.passportUrl = urlDocument.href;
          }
          if (photo !== undefined) {
            const urlPhoto = await ctx.telegram.getFileLink(
              photo[photo.length - 1].file_id,
            );
            user.passportUrl = urlPhoto.href;
          }
          return user;
        }

        return user;
      }),
    );
    const userModel = this.users.find(
      (user) => user.chatId === ctx.message.from['id'],
    );
    console.log(userModel);
    // @todo Сохраняем в базу, данные берем из userModel

    this.users = removeUserFromArray(this.users, ctx);

    await ctx.reply('Ждем вас на концерте!');
    ctx.scene.leave();
  }
}
