import { PrismaClient, Sound, Tag } from '@prisma/client';

interface SoundRepositoryActions {
  findByName(sound: string): Promise<Sound | null>;
  addSingleTag(sound: string, tag: string): Promise<void>;
  exists(name: string): Promise<boolean>;
  add(sound: string): Promise<void>;
  rename(oldName: string, newName: string): Promise<void>;
  remove(name: string): Promise<void>;
  incrementCount(sound: string): Promise<void>;
  withTag(tag: string): Promise<Sound | null>;
  addTags(sound: string, tags: string[]): Promise<void>;
  listTags(sound: string): Promise<Tag[] | null>;
  clearTags(sound: string): Promise<void>;
  mostPlayed(): Promise<Sound[]>;
}

export class SoundRepository implements SoundRepositoryActions {
  constructor(private readonly prismaCient: PrismaClient) {}

  public async findByName(soundName: string): Promise<Sound | null> {
    return await this.prismaCient.sound.findUnique({
      include: {
        tags: true
      },
      where: {
        name: soundName
      }
    });
  }

  public async addSingleTag(sound: string, tag: string): Promise<void> {
    const matchingSound = await this.findByName(sound);
    if (matchingSound) {
      await this.prismaCient.tag.create({
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

  public async withTag(tag: string): Promise<Sound | null> {
    const matchedTags = await this.prismaCient.tag.findFirst({ where: { name: tag } });
    return this.prismaCient.sound.findFirst({
      where: { tags: { some: { id: matchedTags?.id } } }
    });
  }

  public async addTags(sound: string, tags: string[]): Promise<void> {
    if (!(await this.exists(sound))) {
      await this.add(sound);
    }
    tags.forEach(async tag => await this.addSingleTag(sound, tag));
  }

  public async listTags(sound: string): Promise<Tag[] | null> {
    if (!(await this.exists(sound))) {
      return null;
    }
    const tag = await this.prismaCient.tag.findMany({
      where: { sound: { every: { name: sound } } }
    });
    return tag.sort();
  }

  public async clearTags(sound: string): Promise<void> {
    if (!(await this.exists(sound))) {
      return;
    }
    await this.prismaCient.sound.update({
      where: {
        name: sound
      },
      data: {
        tags: {
          deleteMany: {}
        }
      }
    });
  }

  public async mostPlayed(): Promise<Sound[]> {
    return await this.prismaCient.sound.findMany({
      take: 15,
      orderBy: { count: 'desc' }
    });
  }
}
