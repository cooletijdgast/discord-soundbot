import { PrismaClient, Sound } from '@prisma/client';

interface SoundRepositoryActions {
  findByName(sound: string): Promise<Sound | null>;
  addSingleTag(sound: string, tag: string): Promise<void>;
  exists(name: string): Promise<boolean>;
  add(sound: string): Promise<void>;
  rename(oldName: string, newName: string): Promise<void>;
  remove(name: string): Promise<void>;
  incrementCount(sound: string): Promise<void>;
  withTag(tag: string): Promise<Sound>;
  addTags(sound: string, tags: string[]): Promise<void>;
  listTags(sound: string): Promise<Sound>;
  clearTags(sound: string): Promise<void>;
  mostPlayed(): Promise<Sound[]>;
}

export class SoundRepository implements SoundRepositoryActions {
  constructor(private readonly prismaCient: PrismaClient) {}

  public async findByName(soundName: string): Promise<Sound | null> {
    return await this.prismaCient.sound.findUnique({
      where: {
        name: soundName
      }
    });
  }
  public async addSingleTag(sound: string, tag: string): Promise<void> {
    const matchingSound = await this.findByName(sound);
    if (matchingSound) {
      const createdTag = await this.prismaCient.tag.create({
        data: { name: tag, sound: { connect: { id: matchingSound?.id } } }
      });
    }
  }

  public async exists(name: string): Promise<boolean> {
    return !!this.prismaCient.sound.findFirst({ where: { name: name } });
  }

  public async add(sound: string): Promise<void> {
    this.prismaCient.sound.create({ data: { name: sound, count: 0 } });
  }

  public async rename(oldName: string, newName: string): Promise<void> {
    this.prismaCient.sound.update({ where: { name: oldName }, data: { name: newName } });
  }
  public async remove(name: string): Promise<void> {
    this.prismaCient.sound.delete({ where: { name: name } });
  }

  public async incrementCount(sound: string): Promise<void> {
    this.prismaCient.sound.update({ where: { name: sound }, data: { count: { increment: 1 } } });
  }

  public async withTag(tag: string): Promise<Sound> {
    return this.prismaCient.sound.findFirst({ where: { : } });
  }
}
