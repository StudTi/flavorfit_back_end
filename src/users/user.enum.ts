import { registerEnumType } from "@nestjs/graphql";
import { ActivityLevel, Gender, NutritionalGoal } from "prisma/generated/prisma/enums";

registerEnumType(Gender, {
  name: 'Gender'
})

registerEnumType(ActivityLevel, {
  name: 'ActivityLevel'
})

registerEnumType(NutritionalGoal, {
  name: 'NutritionalGoal'
})

