import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import Command from '../base/Command';
import { IgnoreListRepository } from '~/util/db/ignore-list.repository';

export class UnignoreCommand extends Command {
  constructor(private readonly ignoreListRepository: IgnoreListRepository) {
    super();
  }

  public readonly triggers = ['unignore'];
  public readonly usage = 'Usage: !unignore <user>';
  public readonly elevated = true;

  public run(message: Message) {
    const { users } = message.mentions;
    if (users.size < 1) {
      message.channel.send(this.usage);
      message.channel.send(localize.t('helpers.userFinder.error'));
      return;
    }

    users.forEach(async user => {
      await this.ignoreListRepository.remove(user.id);
      message.channel.send(localize.t('commands.ignore.remove', { user: user.username }));
    });
  }
}
