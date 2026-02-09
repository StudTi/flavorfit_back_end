import { Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from 'src/prisma/prisma.service';

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
 
// // Создание рецептов 
//   create(data: IngredientCreateInput) {
//     return this.prisma.ingredient.create({
//       data
//     })
//   }

// // Обновление рецептов 
//   update(id: string, data: IngredientCreateInput) {
//     return this.prisma.ingredient.update({
//       where: { id },
//       data
//     })
//   }

// Удаление рецептов по id
  deleteById(id: string) {
    return this.prisma.recipe.delete({
      where: { id }
    })
  }





}
