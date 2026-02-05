import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesResolver } from './recipes.resolver';
import { IngredientsModule } from './ingredients/ingredients.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [RecipesResolver, RecipesService],
  imports: [PrismaModule, IngredientsModule],
})
export class RecipesModule {}
