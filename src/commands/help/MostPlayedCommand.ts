import { Message } from 'discord.js';

import Command from '../base/Command';
import { SoundRepository } from '~/util/db/sound.repository';
import { Sound } from '@prisma/client';

export class MostPlayedCommand extends Command {
  constructor(private readonly soundRepository: SoundRepository) {
    super();
  }

  public readonly triggers = ['mostplayed'];

  public async run(message: Message) {
    const formattedMessage = await this.getFormattedMessage();
    if (!formattedMessage) return;

    message.channel.send(formattedMessage);
  }

  private async getFormattedMessage() {
    const sounds = await this.soundRepository.mostPlayed();
    if (!sounds.length) return undefined;

    const longestSound = this.findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this.findLongestWord(sounds.map(sound => String(sound.count)));
    return this.formatSounds(sounds, longestSound.length, longestCount.length);
  }

  private findLongestWord(array: string[]) {
    return array.reduce((a, b) => (a.length > b.length ? a : b));
  }

  private formatSounds(sounds: Sound[], soundLength: number, countLength: number) {
    const lines = sounds.map(sound => {
      const spacesForSound = ' '.repeat(soundLength - sound.name.length + 1);
      const spacesForCount = ' '.repeat(countLength - String(sound.count).length);
      return `${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`;
    });
    return ['```', ...lines, '```'].join('\n');
  }
}
