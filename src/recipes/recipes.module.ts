import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesResolver } from './recipes.resolver';
import { IngredientsModule } from './ingredients/ingredients.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminRecipesService } from './admin-recipes.service';

@Module({
  providers: [RecipesResolver, RecipesService, AdminRecipesService],
  imports: [PrismaModule, IngredientsModule],
})
export class RecipesModule {}
