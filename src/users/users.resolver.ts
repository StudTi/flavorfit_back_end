import { Resolver, Query, Mutation, Args, OmitType } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'prisma/generated/prisma/enums';
import { User } from 'prisma/generated/graphql/user/user.model';
import { UserUpdateInput } from './input/user-update.input';

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
  updateProfile(@CurrentUser('id') id: string, @Args('input') input: UserUpdateInput){
    return this.usersService.updateProfile(id, input)
  }

  @Query(() => [User], { name: 'users' })
  @Auth(Role.ADMIN) 
  async getUsers() {
    return this.usersService.findAll()
  }
}

 