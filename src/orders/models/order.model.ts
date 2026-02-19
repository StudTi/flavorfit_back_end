import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { OrderStatus } from '../enums';
import { OrderItemModel } from './order-item.model';

@ObjectType()
export class OrderModel {

  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  orderId!: string;

  @Field(() => OrderStatus, { defaultValue: 'PENDING', nullable: false })
  status!: `${OrderStatus}`;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => [OrderItemModel], { nullable: false })
  items?: OrderItemModel[]
}