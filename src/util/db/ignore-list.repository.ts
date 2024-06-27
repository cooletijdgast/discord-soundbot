import { PrismaClient } from '@prisma/client';

interface IgnoreListRepositoryDescription {
  exists(userId: string): Promise<Boolean>;
  add(userId: string, sound: string): Promise<void>;
  remove(userId: string): Promise<void>;
}

export class IgnoreListRepository implements IgnoreListRepositoryDescription {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async exists(ignoreListId: string): Promise<Boolean> {
    return !!(await this.prismaClient.ignoreList.findFirst({ where: { id: ignoreListId } }));
  }

  public async add(ignoreListId: string): Promise<void> {
    try {
      await this.prismaClient.ignoreList.create({ data: { id: ignoreListId } });
    } catch (error) {
      console.error(error);
    }
  }

  public async remove(ignoreListId: string): Promise<void> {
    try {
      await this.prismaClient.ignoreList.delete({ where: { id: ignoreListId } });
    } catch (error) {
      console.error(error);
    }
  }
}
