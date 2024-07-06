import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Config from '../base/ConfigCommand';
import chunkedMessages from '../util/chunkedMessages';

export class Sounds extends Config {
  public readonly triggers = ['sounds'];

  public run(message: Message, params: string[]) {
    const sounds = getSounds();

    if (!sounds.length) {
      message.author.send(localize.t('commands.sounds.notFound', { prefix: this.config.prefix }));
      return;
    }

    const page = parseInt(params[0]);
    chunkedMessages(sounds, page).forEach(chunk => message.author.send(chunk));
  }
}
