import { Message } from 'discord.js';

import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import chunkedMessages from '../util/chunkedMessages';
import { SoundRepository } from '~/util/db/sound.repository';

export class Tags extends Command {
  constructor(private readonly soundRepository: SoundRepository) {
    super();
  }
  public readonly triggers = ['tags'];

  public async run(message: Message, params: string[]) {
    const sounds = getSounds();
    const soundsWithTags = await this.formattedMessage(sounds);

    const page = parseInt(params[0]);
    chunkedMessages(soundsWithTags, page).forEach(chunk => message.author.send(chunk));
  }

  private formattedMessage(sounds: string[]): Promise<string[]> {
    const longestSound = this.findLongestWord(sounds);
    const soundPromises = sounds.map(
      async sound => await this.listSoundWithTags(sound, longestSound.length)
    );
    return Promise.all(soundPromises);
  }

  private async listSoundWithTags(sound: string, soundLength: number): Promise<string> {
    const tags = await this.soundRepository.listTags(sound);
    if (!tags) {
      return sound;
    }

    const spacesForSound = ' '.repeat(soundLength - sound.length + 1);
    return `${sound}:${spacesForSound}${tags.join(', ')}`;
  }

  private findLongestWord(array: string[]) {
    return array.reduce((a, b) => (a.length > b.length ? a : b));
  }
}
