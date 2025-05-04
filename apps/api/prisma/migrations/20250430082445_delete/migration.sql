/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "deleted_at";
