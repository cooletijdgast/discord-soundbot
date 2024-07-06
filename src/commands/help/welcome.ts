import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import Config from '../base/ConfigCommand';

export class Welcome extends Config {
  public readonly triggers = ['welcome'];

  public run(message: Message) {
    message.channel.send(localize.t('welcome', { prefix: this.config.prefix }));
  }
}
