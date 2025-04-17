/*
  Warnings:

  - Made the column `is_verified` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "is_verified" SET NOT NULL;
