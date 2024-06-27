import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';
import { SoundRepository } from '~/util/db/sound.repository';
import SoundQueue from '~/queue/SoundQueue';
import Config from '~/config/Config';

export class RandomCommand extends QueueCommand {
  constructor(
    private readonly soundRepository: SoundRepository,
    private readonly config: Config
  ) {
    super(new SoundQueue(config, soundRepository));
  }

  public readonly triggers = ['random'];
  public readonly numberOfParameters = 1;

  public async run(message: Message, params: string[]) {
    if (!message.member) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }
    let sounds: string[] = [''];
    if (params.length > 1) {
      sounds = getSounds();
    } else if (params.length === 1) {
      await this.soundRepository.withTag(params[0]).then(sound => {
        if (sound) {
          sound.forEach(singleSound => {
            sounds.push(singleSound.name);
          });
        }
      });
    }
    const random = sounds[Math.floor(Math.random() * sounds.length)];
    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
