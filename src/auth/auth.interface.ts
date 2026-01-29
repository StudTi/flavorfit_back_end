import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Role } from "prisma/generated/prisma/enums"
import { UserModel } from "prisma/generated/prisma/models"

export interface IAuthTokenData {
  id: string
  role: Role
}

export type TCurrentUser = Omit<UserModel, 'password'>

export type TRequestWithUser = {
  user?: TCurrentUser
}

registerEnumType(Role, {
  name: 'Role'
})

@ObjectType()
export class UserModule {
  @Field()
  id: string

  @Field()
  email: string

  @Field(() => Role)  
  role: Role
}

@ObjectType()
export class AuthResponse{
  @Field(() => UserModule)
  user: UserModule

  @Field()
  accessToken: string
}


