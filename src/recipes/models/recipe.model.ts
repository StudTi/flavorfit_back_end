import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Difficulty } from '../recipe.enums';
import { User } from 'prisma/generated/graphql/user';
import { NutritionFactModel } from './nutrition-fact.model';
import { RecipeTagModel } from './recipe-tag.model';
import { RecipeStepModel } from './recipe-steps.model';
import { RecipeIngredientModel } from './recipe-ingredient.model';

@ObjectType()
export class RecipeModel {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    slug!: string;

    @Field(() => String, {nullable:false})
    title!: string;

    @Field(() => String, {nullable:false})
    description!: string;

    @Field(() => Int, {nullable:false})
    calories!: number;

    @Field(() => Int, {nullable:false})
    cookingTime!: number;

    @Field(() => Difficulty, {nullable:false})
    difficulty!: `${Difficulty}`;

    @Field(() => String, {nullable:false})
    authorId!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => User, {nullable:false})
    author?: User;

    @Field(() => [RecipeIngredientModel], {nullable:true})
    recipeIngredients?: Array<RecipeIngredientModel>;

    @Field(() => [RecipeStepModel], {nullable:true})
    recipeSteps?: Array<RecipeStepModel>;

    // @Field(() => [Comment], {nullable:true})
    // comments?: Array<Comment>;

    @Field(() => Int, {nullable:true})
    likes?: number

    @Field(() => [RecipeTagModel], {nullable:true})
    tags?: Array<RecipeTagModel>;

    @Field(() => NutritionFactModel, {nullable:true})
    nutritionFact?: NutritionFactModel | null;
}
