import { Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from 'src/prisma/prisma.service';
import type { RecipeCreateInput } from './inputs/recipe.input';

@Injectable()
export class AdminRecipesService {
  constructor(private readonly prisma: PrismaService) { }
  
  getAll() {
    return this.prisma.ingredient.findMany()
  }

// Получение рецептов по id для ADMIN
  async getById(id: string) {
    const recipe = await this.prisma.ingredient.findUnique({
      where: { id }
    })

    if (!recipe) {
      throw new NotFoundException(`Рецепт с этим наименованием ${id}не найден`)
    }
    return recipe 
  }
 
// Создание рецептов 
  create(
    authorId: string,
    { recipeSteps, nutritionFact, ingredientsIds, tags, ...data }: RecipeCreateInput
  ) {
    return this.prisma.recipe.create({
      data: {
        ...data,
        author: {
          connect: { id: authorId }
        },
        ...(!!nutritionFact && {
          nutritionFact: {
            create: nutritionFact
          }
        }),
        recipeSteps: {
          create: recipeSteps
        },
        ...(!!ingredientsIds?.length && {
          recipeIngredients: {
            create: ingredientsIds.map((ingredientId, index) => ({
              ingredientId,
              quantity: 1,
              order: index
            }))
          }
        }), 
        ...(!!tags?.length && {
          tags: {
            connectOrCreate: tags.map(tag => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }
        })
      }
    })
  }

// Обновление рецептов 
  update(
    id: string,
    {
      recipeSteps,
      nutritionFact,
      ingredientsIds,
      tags,
      ...data
    }: RecipeCreateInput
  ) {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...data, 
        ...(nutritionFact && {
          nutritionFact: {
            upsert: {
              create: nutritionFact,
              update: nutritionFact
            }
          }
        }),
        ...(recipeSteps && {
          recipeSteps: {
            deleteMany: {},
            create: recipeSteps.map(step => ({
              order: step.order,
              title: step.title,
              description: step.description
            }))
          }
        }),
        ...(ingredientsIds && {
          recipeIngredients: {
            deleteMany: {},
            create: ingredientsIds.map((ingredientId, index) => ({
              ingredientId,
              quantity: 1,
              order: index
            }))
          }
        }),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map(tagName => ({
              where: { name: tagName },
              create: { name: tagName }
            }))
          }
        })
      }
    })
  }

// Удаление рецептов по id
  deleteById(id: string) {
    return this.prisma.recipe.delete({
      where: { id }
    })
  }
}
