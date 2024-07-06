import { Message } from 'discord.js';
import fs from 'fs';
import localize from '~/util/i18n/localize';
import { getExtensionForSound, getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import { SoundRepository } from '~/util/db/sound.repository';

export class Rename extends Command {
  public readonly triggers = ['rename'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !rename <old> <new>';
  public readonly elevated = true;

  constructor(private readonly soundRepository: SoundRepository) {
    super();
  }

  public async run(message: Message, params: string[]): Promise<void> {
    if (!message.member) return;

    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [oldName, newName] = params;
    const sounds = getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(localize.t('commands.rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(localize.t('errors.sounds.exists', { sound: newName }));
      return;
    }

    const extension = getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    await this.soundRepository.rename(oldName, newName);

    message.channel.send(localize.t('commands.rename.success', { newName, oldName }));
  }
}
