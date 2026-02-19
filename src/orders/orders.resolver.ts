import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { OrderModel } from './models/order.model';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { OrderCreateInput } from './inputs/order.input';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) { }
  
  @Query(() => [OrderModel], { name: 'myOrders' })
  @Auth()
  getAllByUserId(@CurrentUser('id') userId: string) {
    return this.ordersService.getAllBuUserId(userId)
  }

  @Mutation(() => OrderModel)
  @Auth()
  createOrder(
    @CurrentUser('id') userId: string,
    @Args('input') input: OrderCreateInput
  ) {
    return this.ordersService.makeOrder(userId, input)
  }
}
