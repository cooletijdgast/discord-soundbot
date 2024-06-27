import { Message } from 'discord.js';
import fs from 'fs';

import localize from '~/util/i18n/localize';
import { existsSound, getPathForSound } from '~/util/SoundUtil';

import Command from '../base/Command';
import { SoundRepository } from '~/util/db/sound.repository';

export class RemoveCommand extends Command {
  constructor(private readonly soundRepository: SoundRepository) {
    super();
  }

  public readonly triggers = ['remove'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !remove <sound>';
  public readonly elevated = true;

  public async run(message: Message, params: string[]): Promise<void> {
    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const sound = params.shift()!;
    if (!existsSound(sound)) {
      message.channel.send(localize.t('commands.remove.notFound', { sound }));
      return;
    }

    const file = getPathForSound(sound);
    fs.unlinkSync(file);
    await this.soundRepository.remove(sound);

    message.channel.send(localize.t('commands.remove.success', { sound }));
  }
}
