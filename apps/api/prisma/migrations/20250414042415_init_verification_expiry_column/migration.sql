/*
  Warnings:

  - A unique constraint covering the columns `[verification_link]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verification_expiry" TIMESTAMP(3),
ALTER COLUMN "is_verified" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_link_key" ON "users"("verification_link");
