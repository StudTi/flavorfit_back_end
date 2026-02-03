import { InputType, OmitType } from "@nestjs/graphql";
import { UserUpdateInput } from "prisma/generated/graphql/user/user-update.input";

@InputType() 
export class UserUpdate extends OmitType(UserUpdateInput, ['role']) { }

