import { Resolver, Query, Mutation, Args, OmitType } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'prisma/generated/prisma/enums';
import { User } from 'prisma/generated/models/user/user.model';
import { UserUpdateInput } from 'prisma/generated/models/user/user-update.input';
import { UserUpdate } from './user.updateInput';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => User, { name: 'profile' })
  @Auth()
  getProfile(@CurrentUser('id') id: string) {
    return this.usersService.findById(id)
  }

  @Mutation(() => User)
  @Auth()
  updateProfile(@CurrentUser('id') id: string, @Args('input', {type: () => UserUpdate }) input: UserUpdateInput){
    return this.usersService.updateProfile(id, input)
  }

  @Query(() => [User], { name: 'users' })
  @Auth(Role.ADMIN) 
  async getUsers() {
    return this.usersService.findAll()
  }
}

 