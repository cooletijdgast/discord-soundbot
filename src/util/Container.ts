import Config from '~/config/Config';
import SoundQueue from '~/queue/SoundQueue';

import CommandCollection from '../bot/CommandCollection';
import MessageHandler from '../bot/MessageHandler';
import SoundBot from '../bot/SoundBot';
import {
  AvatarCommand,
  ConfigCommand,
  IgnoreCommand,
  LanguageCommand,
  UnignoreCommand
} from '../commands/config';
import {
  HelpCommand,
  LastAddedCommand,
  MostPlayedCommand,
  PingCommand,
  WelcomeCommand
} from '../commands/help';
import {
  AddCommand,
  DownloadCommand,
  EntranceCommand,
  ExitCommand,
  ModifyCommand,
  RemoveCommand,
  RenameCommand,
  SearchCommand,
  SoundsCommand,
  StopCommand,
  TagCommand,
  TagsCommand
} from '../commands/manage';
import AttachmentDownloader from '../commands/manage/add/downloader/AttachmentDownloader';
import YoutubeDownloader from '../commands/manage/add/downloader/YoutubeDownloader';
import AttachmentValidator from '../commands/manage/add/validator/AttachmentValidator';
import YoutubeValidator from '../commands/manage/add/validator/YoutubeValidator';
import {
  ComboCommand,
  LoopCommand,
  NextCommand,
  RandomCommand,
  SkipCommand,
  SoundCommand
} from '../commands/sound';
import { PrismaClient } from '@prisma/client';
import { SoundRepository } from './db/sound.repository';
import { EntranceRepository } from './db/entrances.repository';
import { ExitRepository } from './db/exit.repository';
import { IgnoreListRepository } from './db/ignore-list.repository';

export const config = new Config();
const prismaClient: PrismaClient = new PrismaClient();
const soundRepository: SoundRepository = new SoundRepository(prismaClient);
const entranceRepository: EntranceRepository = new EntranceRepository(prismaClient);
const exitRepository: ExitRepository = new ExitRepository(prismaClient);
const ignoreListRepository: IgnoreListRepository = new IgnoreListRepository(prismaClient);

const queue = new SoundQueue(config, soundRepository);

const attachmentValidator = new AttachmentValidator(config);
const attachmentDownloader = new AttachmentDownloader(attachmentValidator);

const youtubeValidator = new YoutubeValidator();
const youtubeDownloader = new YoutubeDownloader(youtubeValidator);



const commands = [
  new PingCommand(),

  // SOUND PLAYING RELATED COMMANDS
  new SoundCommand(queue),
  new ComboCommand(queue),
  new RandomCommand(soundRepository, config),
  new LoopCommand(queue),
  new NextCommand(queue),
  new SkipCommand(queue),
  new StopCommand(queue),

  // ENTRANCE / EXIT SOUNDS
  new EntranceCommand(entranceRepository),
  new ExitCommand(exitRepository),

  // SOUND ADMINISTRATION COMMANDS
  new AddCommand(attachmentDownloader, youtubeDownloader),
  new SoundsCommand(config),
  new SearchCommand(soundRepository),
  new ModifyCommand(),
  new RenameCommand(soundRepository),
  new RemoveCommand(soundRepository),
  new TagCommand(soundRepository),
  new TagsCommand(soundRepository),
  new DownloadCommand(),

  // HELP / INFO COMMANDS
  new WelcomeCommand(config),
  new HelpCommand(config),
  new LastAddedCommand(),
  new MostPlayedCommand(soundRepository),

  // CONFIGURATION RELATED COMMANDS
  new AvatarCommand(config),
  new ConfigCommand(config),
  new LanguageCommand(config),
  new IgnoreCommand(ignoreListRepository),
  new UnignoreCommand(ignoreListRepository)
];

const commandCollection = new CommandCollection(commands);
const messageHandler = new MessageHandler(commandCollection, ignoreListRepository);

const soundBot = new SoundBot(config, commandCollection, messageHandler, queue, exitRepository, entranceRepository);

interface SoundBotContainer {
  config: Config;
  soundBot: SoundBot;
}

export default {
  config,
  soundBot
} as SoundBotContainer;
