import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import Command from '../base/Command';
import { IgnoreListRepository } from '~/util/db/ignore-list.repository';

export class IgnoreCommand extends Command {
  constructor(private readonly ignoreListRepository: IgnoreListRepository) {
    super();
  }

  public readonly triggers = ['ignore'];
  public readonly usage = 'Usage: !ignore <user>';
  public readonly elevated = true;

  public run(message: Message) {
    const { users } = message.mentions;
    if (users.size < 1) {
      message.channel.send(this.usage);
      message.channel.send(localize.t('helpers.userFinder.error'));
      return;
    }

    users.forEach(async user => {
      await this.ignoreListRepository.add(user.id);
      message.channel.send(localize.t('commands.ignore.add', { user: user.username }));
    });
  }
}
