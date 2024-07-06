import { Message } from 'discord.js';

import Command from '../base/Command';
import { ExitRepository } from '~/util/db/exit.repository';
import { EntranceRepository } from '~/util/db/entrances.repository';

export class UserSetting extends Command {
  constructor(
    private readonly exitRepository: ExitRepository,
    private readonly entranceRepository: EntranceRepository
  ) {
    super();
  }

  public readonly triggers = ['user-setting'];

  public async run(message: Message) {
    const userEntranceSound = await this.entranceRepository.get(message.author.id);
    const userExitSound = await this.exitRepository.get(message.author.id);
    const entranceSoundMessage = userEntranceSound?.name ? `Entrance sound is set on ${userEntranceSound?.name}. ` : 'Entrance sound is not set. ';
    const exitSoundMessage = userExitSound?.name ? `Exit sound is set on ${userExitSound?.name}. ` : 'Exit sound is not set. ';
    message.channel.send(entranceSoundMessage + exitSoundMessage);
  }
}
