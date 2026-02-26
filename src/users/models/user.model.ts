import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Role } from "prisma/generated/prisma/enums";
import { ProfileModel } from "./profile.model";
import { BodyMeasurementModel } from "./body-measurement.input.model";

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  email!: string

  @Field(() => Role)
  role!: Role

  @Field(() => ProfileModel, { nullable: true })
  profile?: ProfileModel | null

  @Field(() => BodyMeasurementModel, { nullable: true })
  measurement?: BodyMeasurementModel | null

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}