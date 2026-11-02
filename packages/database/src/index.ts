import { PrismaClient } from '@prisma/client';

class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  get user() {
    return this.prisma.user;
  }

  // Add other model delegates as needed
}

export * from '@prisma/client';

export { DatabaseService };

export default new DatabaseService();