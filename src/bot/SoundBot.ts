import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Guild,
  Message,
  PermissionFlagsBits,
  TextChannel,
  VoiceState
} from 'discord.js';

import Config from '~/config/Config';
import QueueItem from '~/queue/QueueItem';
import SoundQueue from '~/queue/SoundQueue';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../commands/base/Command';
import CommandCollection from './CommandCollection';
import MessageHandler from './MessageHandler';
import { ExitRepository } from '~/util/db/exit.repository';
import { EntranceRepository } from '~/util/db/entrances.repository';

export default class SoundBot extends Client {
  private readonly config: Config;
  private readonly commands: CommandCollection;
  private readonly messageHandler: MessageHandler;
  private readonly queue: SoundQueue;

  constructor(
    config: Config,
    commands: CommandCollection,
    messageHandler: MessageHandler,
    queue: SoundQueue,
    private readonly exitRepository: ExitRepository,
    private readonly entranceRepository: EntranceRepository
  ) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
      ]
    });

    this.config = config;
    this.commands = commands;
    this.messageHandler = messageHandler;
    this.queue = queue;

    this.addEventListeners();
  }

  public start() {
    this.login(this.config.token);
  }

  public registerAdditionalCommands(commands: Command[]) {
    this.commands.registerCommands(commands);
  }

  private addEventListeners() {
    this.on('ready', this.onReady);
    this.on('messageCreate', this.onMessage);
    this.on('voiceStateUpdate', this.onUserLeavesVoiceChannel);
    this.on('voiceStateUpdate', this.onUserJoinsVoiceChannel);
    this.on('guildCreate', this.onBotJoinsServer);
    // this.on('error', error => console.log({ error }));
  }

  private onReady() {
    if (!this.user) return;

    this.user.setActivity(this.config.game);
    this.commands.registerUserCommands(this.user);
  }

  private async onUserJoinsVoiceChannel(oldState: VoiceState, newState: VoiceState) {
    const { channel: previousVoiceChannel } = oldState;
    const { channel: currentVoiceChannel, member } = newState;

    if (!member) return;
    if (!currentVoiceChannel || previousVoiceChannel === currentVoiceChannel) return;
    if (!(await this.entranceRepository.exists(member.id))) return;

    const sound = await this.entranceRepository.get(member.id);
    if (sound?.name) {
      if (!getSounds().includes(sound.name)) return;

      this.queue.add(new QueueItem(sound.name, currentVoiceChannel));
    }
  }

  private async onUserLeavesVoiceChannel(oldState: VoiceState, newState: VoiceState) {
    const { channel: previousVoiceChannel } = oldState;
    const { channel: currentVoiceChannel, member } = newState;

    if (!member) return;
    if (!previousVoiceChannel || previousVoiceChannel === currentVoiceChannel) return;
    if (!(await this.exitRepository.exists(member.id))) return;

    const sound = await this.exitRepository.get(member.id);
    if (sound?.name) {
      if (!getSounds().includes(sound.name)) return;

      this.queue.add(new QueueItem(sound.name, previousVoiceChannel));
    }
  }

  private async onMessage(message: Message) {
    await this.messageHandler.handle(message);
  }

  private onBotJoinsServer(guild: Guild) {
    if (!guild.available) return;

    const channel = this.findFirstWritableChannel(guild);
    if (!channel) return;

    channel.send(localize.t('welcome', { prefix: this.config.prefix }));
  }

  private findFirstWritableChannel(guild: Guild) {
    if (!guild.members.me) return undefined;

    const channels = guild.channels.cache
      .filter(channel => channel.type === ChannelType.GuildText)
      .filter(channel => {
        const permissions = channel.permissionsFor(guild.members.me!);

        return Boolean(permissions && permissions.has(PermissionFlagsBits.SendMessages));
      });

    if (!channels.size) return undefined;
    return channels.first() as TextChannel;
  }
}
