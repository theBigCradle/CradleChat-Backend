import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from '../database/database.service';
import { SignUpDto } from '../auth/dto';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}
  private logger: Logger = new Logger(UsersService.name);

  async create(data: SignUpDto) {
    try {
      const result = await this.database.users.create({ data });
      return {
        user: result,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ConflictException('Data already used');
        }
      }
    }
  }

  async fetch() {
    try {
      const result = await this.database.users.findMany();
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
