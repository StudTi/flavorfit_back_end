import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class RecipesQueryInput {
  @Field(() => Int, { defaultValue: 1 })
  page!: number

  @Field(() => Int, { defaultValue: 10 })
  limit!: number

  @Field(() => Int, { nullable: true })
  searchTerm?: string

  @Field(() => Int, { nullable: true })
  sort?: 'new' | 'recommended' | 'popular'
}