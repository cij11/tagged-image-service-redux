import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findUser(username);
  }
}
