import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesResolver } from './recipes.resolver';
import { IngredientsModule } from './ingredients/ingredients.module';
import { AdminRecipesService } from './admin-recipes.service';
import { ReactionModule } from './reaction/reaction.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import './recipe.enums';

@Module({
  providers: [RecipesResolver, RecipesService, AdminRecipesService],
  imports: [IngredientsModule, ReactionModule, PrismaModule],
})
export class RecipesModule {}
