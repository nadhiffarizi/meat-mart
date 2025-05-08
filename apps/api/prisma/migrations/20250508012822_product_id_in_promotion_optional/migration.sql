-- DropForeignKey
ALTER TABLE "discounts" DROP CONSTRAINT "discounts_product_id_fkey";

-- AlterTable
ALTER TABLE "discounts" ALTER COLUMN "product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
