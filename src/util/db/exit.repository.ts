import { Exit, PrismaClient } from '@prisma/client';

interface ExitRepositoryDescription {
  get(userId: string): Promise<Exit | null>;
  exists(userId: string): Promise<Boolean>;
  add(userId: string, sound: string): Promise<void>;
  remove(userId: string): Promise<void>;
}

export class ExitRepository implements ExitRepositoryDescription {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async get(userId: string): Promise<Exit | null> {
    return await this.prismaClient.exit.findFirst({ where: { userId: userId } });
  }

  public async exists(userId: string): Promise<Boolean> {
    return !!(await this.prismaClient.exit.findFirst({ where: { userId: userId } }));
  }

  public async add(userId: string, sound: string): Promise<void> {
    try {
      if (!this.exists(userId)) {
        console.log('create new one');
        await this.prismaClient.exit.create({ data: { userId: userId, name: sound } });
      } else {
        const existingExitSound = await this.get(userId);
        if (existingExitSound?.name === sound) {
          console.debug(
            `Requested exit sound ${sound} is the same as in the database ${existingExitSound.name}`
          );
          return;
        }
        console.log('removing', existingExitSound);
        await this.remove(userId);
        await this.prismaClient.exit.create({ data: { userId: userId, name: sound } });
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async remove(userId: string): Promise<void> {
    try {
      await this.prismaClient.exit.delete({ where: { userId: userId } });
    } catch (error) {
      console.error(error);
    }
  }
}
