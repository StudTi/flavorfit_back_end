import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipeCreateInput } from './inputs/recipe.input';

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
    { recipeSteps, nutritionFact, ingredients, tags, ...data }: RecipeCreateInput
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
        ...(!!ingredients?.length && {
          recipeIngredients: {
            create: ingredients.map((item, index) => ({
              ingredientId: item.ingredientId,
              quantity: item.quantity,
              unit: item.unit,
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
      ingredients,
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
        ...(ingredients && {
          recipeIngredients: {
            deleteMany: {},
            create: ingredients.map((item, index) => ({
              ingredientId: item.ingredientId,
              quantity: item.quantity,
              unit: item.unit,
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
