import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from 'src/prisma/prisma.service';
import type { OrderCreateInput } from './inputs/order.input';
import { QueueAction } from 'rxjs/internal/scheduler/QueueAction';
import { OrderStatus } from 'prisma/generated/graphql/prisma';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }
  
  getAllBuUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            recipeIngredients: {
              include: {
                ingredient: true,
                recipe: true
              }
            }
          }
        }
      }
    })
  }

  async makeOrder(userId: string, input: OrderCreateInput) {
    if (!input.items.length) {
      throw new BadRequestException('Заказ должен содержать как минимум один заказ')
    }

    const generatedOrderId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
    
    const recipeIngredientIds = input.items.map(item => item.recipeIngredientId)

    const recipeIngredients = await this.prisma.recipeIngredient.findMany({
      where: { id: { in: recipeIngredientIds } },
      include: {
        ingredient: true
      }
    })

    const ingredientsMap = new Map(recipeIngredients.map( ri => [ri.id, ri]))


    //* Считаем цену для каждого item + total
    
    let total = 0
    const itemsWithPrice = input.items.map(item => {
      const recipeIngredient = ingredientsMap.get(item.recipeIngredientId)

      if (!recipeIngredient) {
        throw new NotFoundException(
          `Ингредиент ${item.recipeIngredientId} для рецепта не найден`
        )
      }

      const averagePrice = Number(recipeIngredient.ingredient.price || 0)
      const itemPrice = averagePrice * item.quantity

      total += itemPrice

      return {
        recipeIngredientId: item.recipeIngredientId,
        quantity: item.quantity,
        price: itemPrice
      }
    })

    //* Создаем заказ с total
    return this.prisma.order.create({
      data: {
        orderId: generatedOrderId,
        userId,
        status: OrderStatus.PENDING,
        total,
        items: {
          create: itemsWithPrice
        }
      },
      include: {
        items: {
          include: {
            recipeIngredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      }
    })
  }
}
 