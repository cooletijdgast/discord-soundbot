import { Message } from 'discord.js';

import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import { EntranceRepository } from '~/util/db/entrances.repository';

export class EntranceCommand extends Command {
  constructor(private readonly entranceRepository: EntranceRepository) {
    super();
  }

  public readonly triggers = ['entrance'];

  public async run(message: Message, params: string[]) {
    const [entranceSound] = params;
    if (!entranceSound) {
      await this.entranceRepository.remove(message.author.id);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(entranceSound)) return;

    await this.entranceRepository.add(message.author.id, entranceSound);
  }
}
