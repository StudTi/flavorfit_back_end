import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileUpdateWithoutUserInput } from 'prisma/generated/graphql/profile';
import { BodyMeasurementUpdateWithoutUserInput } from 'prisma/generated/graphql/body-measurement';

@InputType()
export class UserUpdateInput {

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => String, {nullable:true})
    password?: string;

    @Field(() => ProfileUpdateWithoutUserInput, {nullable:true})
    profile?: ProfileUpdateWithoutUserInput;

    @Field(() => BodyMeasurementUpdateWithoutUserInput, {nullable:true})
    measurements?: BodyMeasurementUpdateWithoutUserInput;

}
