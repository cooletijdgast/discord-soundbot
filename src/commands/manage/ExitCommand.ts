import { Message } from 'discord.js';

import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import { ExitRepository } from '~/util/db/exit.repository';

export class ExitCommand extends Command {
  constructor(private readonly exitRepository: ExitRepository) {
    super();
  }

  public readonly triggers = ['exit'];

  public async run(message: Message, params: string[]) {
    const [exitSound] = params;
    if (!exitSound) {
      await this.exitRepository.remove(message.author.id);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(exitSound)) return;

    await this.exitRepository.add(message.author.id, exitSound);
  }
}
