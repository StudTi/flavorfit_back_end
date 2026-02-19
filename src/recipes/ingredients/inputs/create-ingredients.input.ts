import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IngredientCreateInput {
  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String)
  iconUrl!: string

  @Field(() => String)
  content!: string

  @Field(() => Number)
  price!: number
}