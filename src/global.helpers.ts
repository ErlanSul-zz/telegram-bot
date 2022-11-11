import { UsersInterface } from './telegram-bot/interfaces/users.interface';
import { Scenes } from 'telegraf';

export const removeUserFromArray = (
  users: Partial<UsersInterface>[],
  ctx: Scenes.WizardContext,
): Partial<UsersInterface>[] => {
  return users.filter((user) => user.chatId !== ctx.message.from['id']);
};

export const getArrayForCallbackQuery = (
  users: Partial<UsersInterface>[],
  value: string,
  ctx: Scenes.WizardContext,
): Partial<UsersInterface>[] => {
  return users.map((user) => {
    if (user.chatId === ctx.callbackQuery.from.id) {
      user[value] = ctx.callbackQuery.data;
      return user;
    }
    return user;
  });
};

export const getArrayForText = (
  users: Partial<UsersInterface>[],
  value: string,
  ctx: Scenes.WizardContext,
): Partial<UsersInterface>[] => {
  return users.map((user) => {
    if (user.chatId === ctx.message.from['id']) {
      user[value] = ctx.message['text'];
      return user;
    }
    return user;
  });
};
