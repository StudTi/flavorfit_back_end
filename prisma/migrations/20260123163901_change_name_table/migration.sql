/*
  Warnings:

  - You are about to drop the `BodyMeasurement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Courier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BodyMeasurement" DROP CONSTRAINT "BodyMeasurement_user_id_fkey";

-- DropTable
DROP TABLE "BodyMeasurement";

-- DropTable
DROP TABLE "Courier";

-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_measurements" (
    "id" TEXT NOT NULL,
    "height_cm" INTEGER,
    "weight_kg" INTEGER,
    "goal_weight_kg" INTEGER,
    "chest_cm" INTEGER,
    "waist_cm" INTEGER,
    "thigh_cm" INTEGER,
    "arm_cm" INTEGER,
    "activityLevel" "ActivityLevel",
    "nutritionalGoal" "NutritionalGoal",
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "body_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "body_measurements_user_id_key" ON "body_measurements"("user_id");

-- AddForeignKey
ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
