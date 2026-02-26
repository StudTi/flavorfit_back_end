import { Field, InputType, Int } from "@nestjs/graphql";
import { ActivityLevel, NutritionalGoal } from "prisma/generated/prisma/enums";

@InputType()
export class BodyMeasurementUpdateInput {
  @Field(() => Int, { nullable: true })
  heightCm?: number | null

  @Field(() => Int, { nullable: true })
  weightCm?: number | null

  @Field(() => Int, { nullable: true })
  goalWeightKg?: number | null

  @Field(() => Int, { nullable: true })
  chestCm?: number | null

  @Field(() => Int, { nullable: true })
  waistCm?: number | null

  @Field(() => Int, { nullable: true })
  thighCm?: number | null
  
  @Field(() => Int, { nullable: true })
  armCm?: number | null

  @Field(() => ActivityLevel, { nullable: true })
  activityLevel?: ActivityLevel | null

  @Field(() => NutritionalGoal, { nullable: true })
  nutritionalGoal?: NutritionalGoal | null
}