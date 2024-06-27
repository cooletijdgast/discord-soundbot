import '../discord/Message';

import { Message } from 'discord.js';

import userHasElevatedRole from '~/commands/util/userHasElevatedRole';
import { config } from '~/util/Container';
import localize from '~/util/i18n/localize';

import CommandCollection from './CommandCollection';
import { IgnoreListRepository } from '~/util/db/ignore-list.repository';

export default class MessageHandler {
  private readonly commands: CommandCollection;

  constructor(commands: CommandCollection, private readonly ignoreListRepository: IgnoreListRepository) {
    this.commands = commands;
  }

  public async handle(message: Message) {
    if (!await this.isValidMessage(message)) return;

    const messageToHandle = message;
    messageToHandle.content = message.content.substring(config.prefix.length);

    this.execute(messageToHandle);
  }

  private async isValidMessage(message: Message) {
    return (
      !message.author.bot &&
      !message.isDirectMessage() &&
      message.hasPrefix(config.prefix) &&
      !await this.ignoreListRepository.exists(message.author.id)
    );
  }

  private execute(message: Message) {
    const [command, ...params] = message.content.split(' ');
    const commandToRun = this.commands.get(command);

    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    commandToRun.run(message, params);
  }
}
