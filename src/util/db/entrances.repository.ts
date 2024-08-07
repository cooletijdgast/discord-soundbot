import { Entrance, PrismaClient } from '@prisma/client';

interface EntranceRepositoryDescription {
  get(userId: string): Promise<Entrance | null>;
  exists(userId: string): Promise<Boolean>;
  add(userId: string, sound: string): Promise<void>;
  remove(userId: string): Promise<void>;
}

export class EntranceRepository implements EntranceRepositoryDescription {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async get(userId: string): Promise<Entrance | null> {
    return await this.prismaClient.entrance.findFirst({ where: { userId: userId } });
  }

  public async exists(userId: string): Promise<Boolean> {
    return !!(await this.prismaClient.entrance.findFirst({ where: { userId: userId } }));
  }

  public async add(userId: string, sound: string): Promise<void> {
    try {
      if (!this.exists(userId)) {
        await this.prismaClient.entrance.create({ data: { userId: userId, name: sound } });
      } else {
        const existingEntranceSound = await this.get(userId);
        if (existingEntranceSound?.name === sound) {
          console.debug(
            `Requested entrance sound ${sound} is the same as in the database ${existingEntranceSound.name}`
          );
          return;
        }
        await this.remove(userId);
        await this.prismaClient.entrance.create({ data: { userId: userId, name: sound } });
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async remove(userId: string): Promise<void> {
    try {
      await this.prismaClient.entrance.delete({ where: { userId: userId } });
    } catch (error) {
      console.error(error);
    }
  }
}
