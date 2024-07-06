import BotConfig from '~/config/Config';

import Command from './Command';

export default abstract class Config extends Command {
  protected readonly config: BotConfig;

  constructor(config: BotConfig) {
    super();
    this.config = config;
  }
}
