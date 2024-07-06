import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import { SoundRepository } from '~/util/db/sound.repository';

export class Search extends Command {
  public readonly triggers = ['search'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !search <tag>';

  constructor(private readonly soundRepository: SoundRepository) {
    super();
  }

  public async run(message: Message, params: string[]): Promise<void> {
    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const tag = params.shift()!;
    const results = getSounds().filter(sound => sound.includes(tag));
    const returnedSound = await this.soundRepository.withTag(tag);
    if (returnedSound) {
      returnedSound.forEach(sound => results.push(sound.name));
    }

    if (!results.length) {
      message.author.send(localize.t('commands.search.notFound'));
      return;
    }

    const uniqueResults = [...new Set(results)].sort();
    message.author.send(uniqueResults.join('\n'));
  }
}
