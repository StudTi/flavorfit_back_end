import { Resolver, Query, Mutation, Args, OmitType } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'prisma/generated/prisma/enums';
import { UserUpdateInput } from './input/user-update.input';
import { UserModel } from './models/user.model';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => UserModel, { name: 'profile' })
  @Auth()
  getProfile(@CurrentUser('id') id: string) {
    return this.usersService.findById(id)
  }

  @Mutation(() => UserModel)
  @Auth()
  updateProfile(@CurrentUser('id') id: string, @Args('input') input: UserUpdateInput){
    return this.usersService.updateProfile(id, input)
  }

  @Query(() => [UserModel], { name: 'users' })
  @Auth(Role.ADMIN) 
  async getUsers() {
    return this.usersService.findAll()
  }
}

 