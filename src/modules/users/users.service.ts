import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from '../database/database.service';
import { SignUpDto } from '../auth/dto';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

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
}
