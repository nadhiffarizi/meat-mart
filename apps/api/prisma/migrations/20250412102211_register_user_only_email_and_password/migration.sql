/*
  Warnings:

  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "is_verified" DROP NOT NULL,
ALTER COLUMN "verification_link" DROP NOT NULL;
