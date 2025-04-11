/*
  Warnings:

  - The values [SUBSTRACT] on the enum `E_StockStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `recipent_name` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `is_valied` on the `discounts` table. All the data in the column will be lost.
  - Added the required column `is_selected` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_name` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_valid` to the `discounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "E_StockStatus_new" AS ENUM ('ADD', 'SUBTRACT', 'SNAPSHOT');
ALTER TABLE "stockhistory" ALTER COLUMN "status" TYPE "E_StockStatus_new" USING ("status"::text::"E_StockStatus_new");
ALTER TYPE "E_StockStatus" RENAME TO "E_StockStatus_old";
ALTER TYPE "E_StockStatus_new" RENAME TO "E_StockStatus";
DROP TYPE "E_StockStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "recipent_name",
ADD COLUMN     "is_selected" BOOLEAN NOT NULL,
ADD COLUMN     "recipient_name" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "discounts" DROP COLUMN "is_valied",
ADD COLUMN     "is_valid" BOOLEAN NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orderstatushistory" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "productpictures" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "stockhistory" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "stocks" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "transactiondetails" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "amount_discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
