/*
  Warnings:

  - You are about to drop the column `product_id` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_product_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "product_id";
