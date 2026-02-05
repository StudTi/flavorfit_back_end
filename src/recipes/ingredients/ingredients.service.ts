import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { IngredientCreateInput } from './inputs/create-ingredients.input';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) { }

  getAll() {
    return this.prisma.ingredient.findMany()
  }

// Получение ингридиентов по id
  async getById(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id }
    })

    if (!ingredient) {
      throw new NotFoundException(`Ингредиент с этим ID ${id}не найден`)
    }
    return ingredient 
  }

// Создание ингредиентов 
  create(data: IngredientCreateInput) {
    return this.prisma.ingredient.create({
      data
    })
  }

// Обновление ингредиентов 
  update(id: string, data: IngredientCreateInput) {
    return this.prisma.ingredient.update({
      where: { id },
      data
    })
  }

// Удаление ингридиентов по id
  deleteById(id: string) {
    return this.prisma.ingredient.delete({
      where: { id }
    })
  }




}
