import { Field, ObjectType } from "@nestjs/graphql"
import type { Pick } from "@prisma/client/runtime/client"
import { User } from "prisma/generated/graphql/user"

export type TAuthTokenData = Pick<User, 'id'| 'role'>

export type TCurrentUser = Omit<User, 'password'>

export type TRequestWithUser = {
  user?: TCurrentUser
}

@ObjectType()
export class AuthResponse{
  @Field(() => User)
  user: User

  @Field()
  accessToken: string
}


