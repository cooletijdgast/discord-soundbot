import { Message } from 'discord.js';

import { getSounds, getSoundWithExtension } from '~/util/SoundUtil';

import Command from '../base/Command';
import { EntranceRepository } from '~/util/db/entrances.repository';

export class Entrance extends Command {
  constructor(private readonly entranceRepository: EntranceRepository) {
    super();
  }

  public readonly triggers = ['entrance'];

  public async run(message: Message, params: string[]) {
    console.log(message, params);
    let [entranceSound] = params;
    if (!entranceSound) {
      await this.entranceRepository.remove(message.author.id);
      return;
    }

    const sounds = getSounds();
    entranceSound = getSoundWithExtension(entranceSound).name;
    if (!sounds.includes(entranceSound)) {
      console.debug(`Sound does ${entranceSound} not exist`);
      return;
    }

    await this.entranceRepository.add(message.author.id, entranceSound);
  }
}
