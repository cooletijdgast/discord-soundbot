import { Message } from 'discord.js';

import Queue from '../base/Queue';

export class Stop extends Queue {
  public readonly triggers = ['leave', 'stop'];

  public run(message: Message) {
    if (!message.guild) return;
    if (!message.guild.members.me) return;

    this.queue.clear();

    message.guild.members.me.voice.disconnect();
  }
}
