// Получение - отправление
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IngredientsService } from './ingredients.service';
import { IngredientModel } from './models/ingredient.model';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'prisma/generated/prisma/enums';
import { IngredientCreateInput } from './inputs/create-ingredients.input';

@Resolver()
export class IngredientsResolver {
  constructor(private readonly ingredientsService: IngredientsService) { }
  
  @Query(() => [IngredientModel], {
    name: 'ingredients'
  })
  @Auth(Role.ADMIN)                 //* Может применять изменения только админ
  getAll() {
    return this.ingredientsService.getAll()
  }

  @Query(() => IngredientModel, {
    name: 'ingredientById'
  })
  @Auth(Role.ADMIN)
  getById(
    @Args('id') id: string) {
    return this.ingredientsService.getById(id)
  }

  @Mutation(() => IngredientModel)
  @Auth(Role.ADMIN)
  createIngredient(@Args('input') input: IngredientCreateInput) {
    return this.ingredientsService.create(input)
  }
  
  @Mutation(() => IngredientModel)
  @Auth(Role.ADMIN)
  updateIngredient(@Args('id') id: string, @Args('input') input: IngredientCreateInput) {
    return this.ingredientsService.update(id, input)
  }

  @Mutation(() => IngredientModel)
  @Auth(Role.ADMIN)
  deleteIngredientById(@Args('id') id: string) {
    return this.ingredientsService.deleteById(id)
  }
}
