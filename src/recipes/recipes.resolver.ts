import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'prisma/generated/prisma/enums';
import { AdminRecipesService } from './admin-recipes.service';
import { RecipeModel } from './models/recipe.model';
import { RecipesService } from './recipes.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { RecipeCreateInput } from './inputs/recipe.input';
import { RecipesQueryInput } from './inputs/get-recipes.input';

@Resolver()
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService,
    private readonly adminRecipesService: AdminRecipesService
  ) { }
  
  @Query(() => [RecipeModel], {
    name: 'recipes'
  })
  getAll(@Args('input') input: RecipesQueryInput) {
    return this.recipesService.getAll(input)
    }

  @Query(() => [RecipeModel], {
    name: 'recipeBySlug'
  })
  getBySlug(@Args('slug') slug: string) {
    return this.recipesService.getBySlug(slug)
  }

  @Query(() => [RecipeModel], {
    name: 'adminRecipes'
  })
  @Auth(Role.ADMIN)                 //* Может применять изменения только админ
  getAllAdmin() {
    return this.adminRecipesService.getAll()
  }

  @Query(() => RecipeModel, {
    name: 'recipeById'
  })
  @Auth(Role.ADMIN)
  getById(
    @Args('id') id: string) {
    return this.adminRecipesService.getById(id)
  }

  @Mutation(() => RecipeModel)
  @Auth(Role.ADMIN)
  createRecipe(
    @CurrentUser('id') authorId: string,
    @Args('input') input: RecipeCreateInput) {
    return this.adminRecipesService.create(authorId, input)
  }
  
  @Mutation(() => RecipeModel)
  @Auth(Role.ADMIN)
  updateRecipe(
    @Args('id') id: string,
    @Args('input') input: RecipeCreateInput
  ) {
    return this.adminRecipesService.update(id, input)
  }

  @Mutation(() => RecipeModel)
  @Auth(Role.ADMIN)
  deleteIngredientById(@Args('id') id: string) {
    return this.adminRecipesService.deleteById(id)
  }
}
