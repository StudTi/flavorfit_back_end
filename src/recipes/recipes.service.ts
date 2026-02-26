import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipesQueryInput } from './inputs/get-recipes.input';
import { Prisma } from 'prisma/generated/prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) { }
  
  async getAll({ page, limit, searchTerm, sort }: RecipesQueryInput) {
    const skip = (page - 1) * limit

    return this.prisma.recipe.findMany({
      skip,
      take: limit,

      where: {
        ...(searchTerm && {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            {
              recipeIngredients: {
                some: { 
                  ingredient: {
                    name: { contains: searchTerm, mode: 'insensitive' }
                  }
                }
              }
            }
          ]
        })
      }, 

      orderBy: this.getOrderBy(sort), 

      include: {
        _count: {
          select: { likes: true }
        }
      }
    })
  }

//* Сортировка (рекомендации - по лайку / популярность - просмотры / дефолт - по дате)
  private getOrderBy(sort?: string) {
    switch (sort) {
      case 'recommended':
        return { likes: { _count: Prisma.SortOrder.desc } } 
      
      case 'popular': 
        return { views: Prisma.SortOrder.desc }
      
      default: 
        return { createdAt: Prisma.SortOrder.desc }
    }
  }

//* Получение рецептов по slug для USER
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






