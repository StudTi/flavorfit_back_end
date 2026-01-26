import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Role } from "prisma/generated/prisma/enums"

export interface IAuthTokenData {
  id: string
  role: Role
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


