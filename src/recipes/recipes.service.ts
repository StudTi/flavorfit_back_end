import { Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) { }
  
  getAll() {
    return this.prisma.ingredient.findMany()
  }

// Получение рецептов по slug для USER
  async getBySlug(slug: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        slug
      },
      include: {
        recipeSteps: true,
        recipeIngredients: {
          include: {
            ingredient: true
          }
        }
      }
    })

    if (!recipe) {
      throw new NotFoundException(`Рецепт с этим ID ${slug}не найден`)
    }
    return recipe
  }
}






