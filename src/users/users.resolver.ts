import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserProfileModel } from './models/user-profile.model';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'prisma/generated/prisma/enums';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Auth()
  @Query(() => UserProfileModel, { name: 'profile' })
  getProfile(@CurrentUser('id') id: string) {
    return this.usersService.findById(id)
  }

  @Query(() => [UserProfileModel], { name: 'users' })
  @Auth(Role.ADMIN)
  async getUsers() {
    return this.usersService.findAll()
  }
}

