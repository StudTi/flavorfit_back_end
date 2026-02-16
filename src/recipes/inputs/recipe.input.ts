import { Field, ID, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { NutritionFactUpdateInput } from "./nutrition-fact.input";
import { RecipeStepInput } from "./step.input";
import { Difficulty } from "../recipe.enums";


@InputType()
export class RecipeCreateInput {

  @Field(() => String, { nullable: false })
  slug!: string;

  @Field(() => String, { nullable: false })
  title!: string;

  @Field(() => String, { nullable: false })
  description!: string;

  @Field(() => Int, { nullable: false })
  calories!: number;

  @Field(() => Int, { nullable: false })
  cookingTime!: number;

  @Field(() => Difficulty, { nullable: false })
  difficulty!: `${Difficulty}`;

  @Field(() => [ID], { nullable: true })
  ingredientsIds?: string [];

  @Field(() => [RecipeStepInput], { nullable: true })
  recipeSteps?: RecipeStepInput[];

  @Field(() => String, { nullable: true })
  tags?: string[];

  @Field(() => NutritionFactUpdateInput, { nullable: true })
  nutritionFact?: NutritionFactUpdateInput;
}
