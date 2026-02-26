import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProfileUpdateInput } from './profile.input';
import { BodyMeasurementUpdateInput } from './body-measurement.input';

@InputType()
export class UserUpdateInput {

    @Field(() => String, {nullable:true})
    email?: string;

    @Field(() => String, {nullable:true})
    password?: string;

    @Field(() => ProfileUpdateInput, {nullable:true})
    profile?: ProfileUpdateInput;

    @Field(() => BodyMeasurementUpdateInput, {
        nullable: true
    })
    measurements?: BodyMeasurementUpdateInput;

}
