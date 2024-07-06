import Queue from '../base/Queue';

export class SkipCommand extends Queue {
  public readonly triggers = ['skip'];

  public run() {
    this.queue.next();
  }
}
