/*
  Warnings:

  - You are about to drop the column `quality` on the `recipe_ingredients` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `recipe_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe_ingredients" DROP COLUMN "quality",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT;
