import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Gender } from "prisma/generated/prisma/enums";

@ObjectType()
export class ProfileModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  fullName!: string

  @Field(() => Gender, { nullable: true })
  gender!: Gender | null

  @Field(() => Int, { nullable: true })
  age!: number | null

  @Field(() => ID)
  bio!: string | null

  @Field(() => ID)
  createdAt!: Date

  @Field(() => ID)
  updatedAt!: Date
}