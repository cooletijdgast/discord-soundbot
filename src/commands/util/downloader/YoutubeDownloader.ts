import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import ytdl from 'ytdl-core';

import getSecondsFromTime from '~/util/getSecondsFromTime';
import localize from '~/util/i18n/localize';

import BaseDownloader from './BaseDownloader';
import YoutubeValidator from './validator/YoutubeValidator';

interface ConvertOptions {
  soundName: string;
  startTime: Nullable<string>;
  endTime: Nullable<string>;
}

interface DownloadOptions extends ConvertOptions {
  url: string;
}

export default class YoutubeDownloader extends BaseDownloader {
  protected readonly validator: YoutubeValidator;

  constructor(youtubeValidator: YoutubeValidator) {
    super();

    this.validator = youtubeValidator;
  }

  public handle(message: Message, params: string[]) {
    if (params.length < 2 || params.length > 4) return;

    const [soundName, url, startTime, endTime] = params;

    this.validator
      .validate(soundName, url)
      .then(() => this.addSound({ endTime, soundName, startTime, url }))
      .then(result => message.channel.send(result))
      .catch(result => message.channel.send(result));
  }

  private addSound({ url, soundName, startTime, endTime }: DownloadOptions) {
    return this.download(url)
      .then(() => this.convert({ endTime, soundName, startTime }))
      .then(() => this.cleanUp(soundName))
      .catch(this.handleError);
  }

  private download(url: string) {
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: format => format.container === 'mp4' })
        .pipe(fs.createWriteStream('tmp.mp4'))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  private convert({ soundName, startTime, endTime }: ConvertOptions) {
    let ffmpegCommand = ffmpeg('tmp.mp4').output(`./sounds/${soundName}.mp3`);

    const start = getSecondsFromTime(startTime);
    const end = getSecondsFromTime(endTime);

    if (start) ffmpegCommand = ffmpegCommand.setStartTime(start);
    if (start && end) ffmpegCommand = ffmpegCommand.setDuration(end - start);

    return new Promise((resolve, reject) => {
      ffmpegCommand.on('end', resolve).on('error', reject).run();
    });
  }

  private cleanUp(name: string) {
    fs.unlinkSync('tmp.mp4');

    return Promise.resolve(localize.t('commands.add.success', { name }));
  }

  private handleError(error: Error) {
    console.error(error);

    return Promise.reject(localize.t('commands.add.error'));
  }
}