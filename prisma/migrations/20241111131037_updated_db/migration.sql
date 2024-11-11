/*
  Warnings:

  - The values [Vendor,Hr] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `safeWallet_confirmation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CaChingNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelRecipient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CpcEmployee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafeWallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShoppingCart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeeklyPayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeeklyUserPayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FileToMenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FileToVendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageVariationToVendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('Guest', 'User', 'Manager', 'Admin');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CaChingNotification" DROP CONSTRAINT "CaChingNotification_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "CaChingNotification" DROP CONSTRAINT "CaChingNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRecipient" DROP CONSTRAINT "ChannelRecipient_channelId_fkey";

-- DropForeignKey
ALTER TABLE "CpcEmployee" DROP CONSTRAINT "CpcEmployee_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_image_id_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_transactioinId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SafeWallet" DROP CONSTRAINT "SafeWallet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_menu_item_id_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "VendorSchedule" DROP CONSTRAINT "VendorSchedule_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyUserPayout" DROP CONSTRAINT "WeeklyUserPayout_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyUserPayout" DROP CONSTRAINT "WeeklyUserPayout_payout_id_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyUserPayout" DROP CONSTRAINT "WeeklyUserPayout_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "_FileToMenuItem" DROP CONSTRAINT "_FileToMenuItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToMenuItem" DROP CONSTRAINT "_FileToMenuItem_B_fkey";

-- DropForeignKey
ALTER TABLE "_FileToVendor" DROP CONSTRAINT "_FileToVendor_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToVendor" DROP CONSTRAINT "_FileToVendor_B_fkey";

-- DropForeignKey
ALTER TABLE "_ImageVariationToVendor" DROP CONSTRAINT "_ImageVariationToVendor_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageVariationToVendor" DROP CONSTRAINT "_ImageVariationToVendor_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "safeWallet_confirmation";

-- DropTable
DROP TABLE "CaChingNotification";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "ChannelRecipient";

-- DropTable
DROP TABLE "CpcEmployee";

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "SafeWallet";

-- DropTable
DROP TABLE "ShoppingCart";

-- DropTable
DROP TABLE "SubCategory";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "Vendor";

-- DropTable
DROP TABLE "VendorSchedule";

-- DropTable
DROP TABLE "WeeklyPayout";

-- DropTable
DROP TABLE "WeeklyUserPayout";

-- DropTable
DROP TABLE "_FileToMenuItem";

-- DropTable
DROP TABLE "_FileToVendor";

-- DropTable
DROP TABLE "_ImageVariationToVendor";

-- DropEnum
DROP TYPE "CaChingStatus";

-- DropEnum
DROP TYPE "ChannelStatus";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "OrderType";

-- DropEnum
DROP TYPE "PayoutStatus";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- DropEnum
DROP TYPE "TxCategory";

-- DropEnum
DROP TYPE "VendorConfirmation";

-- DropEnum
DROP TYPE "Weekday";
