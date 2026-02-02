import { InputType, OmitType } from "@nestjs/graphql";
import { UserUpdateInput } from "prisma/generated/models/user/user-update.input";

@InputType() 
export class UserUpdate extends OmitType(UserUpdateInput, ['role']) { }

