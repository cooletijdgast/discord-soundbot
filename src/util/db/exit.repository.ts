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
      await this.prismaClient.exit.create({ data: { userId: userId, name: sound } });
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
