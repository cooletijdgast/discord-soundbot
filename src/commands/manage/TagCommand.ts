import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import { SoundRepository } from '~/util/db/sound.repository';

export class TagCommand extends Command {
  public readonly triggers = ['tag'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';
  public readonly elevated = true;

  constructor(private readonly soundRepository: SoundRepository) {
    super();
  }

  public async run(message: Message, params: string[]): Promise<void> {
    if (params.length < this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const sound = params.shift()!;
    if (!getSounds().includes(sound)) {
      message.channel.send(localize.t('commands.tag.notFound', { sound }));
      return;
    }

    if (!params.length) {
      const tags = await this.soundRepository.listTags(sound);
      if (tags) {
        let tag = tags.join(', ');
        message.author.send(localize.t('commands.tag.found', { sound, tag }));
      }
      return;
    }

    if (params[0] === 'clear') {
      await this.soundRepository.clearTags(sound);
      return;
    }

    await this.soundRepository.addTags(sound, params);
  }
}
