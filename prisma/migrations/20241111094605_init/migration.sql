-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'FINISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "TxCategory" AS ENUM ('NOT_SPECIFIED', 'PAYOUT', 'ONRAMP', 'CHANNEL_CLOSE', 'CHANNEL_OPEN', 'WALLET_CREATION', 'USER_SEND_ONCHAIN', 'USER_SEND_CHANNEL', 'NFT_REVEAL');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'FINISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "CaChingStatus" AS ENUM ('PLANNED', 'FINISHED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ORDER', 'PAYMENT_CHANNEL', 'ON_CHAIN');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('PLAIN_AMOUNT', 'VENDOR_CREATED', 'USER_CREATED');

-- CreateEnum
CREATE TYPE "ImageSize" AS ENUM ('ORIGINAL', 'THUMBNAIL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Guest', 'User', 'Vendor', 'Hr', 'Admin');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VendorConfirmation" AS ENUM ('INITIAL', 'CONFIRMED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('PLANNED', 'OPEN', 'FAILED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PreferenceKey" AS ENUM ('SHOW_BALANCE', 'SHARE_FULLNAME', 'SHARE_FIRSTNAME', 'SHARE_PROFILE_IMAGE', 'SEND_UPDATES');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "pwd_hash" TEXT,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "phone_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "role" "UserRole" NOT NULL,
    "safeWallet_confirmation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_id" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPayout" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payouts_status" "PayoutStatus" NOT NULL,

    CONSTRAINT "WeeklyPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CpcEmployee" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "empoyment_active" BOOLEAN NOT NULL,
    "employment_start_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CpcEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyUserPayout" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" UUID NOT NULL,
    "payout_id" UUID NOT NULL,
    "transaction_id" UUID,
    "payouts_status" "PayoutStatus" NOT NULL,

    CONSTRAINT "WeeklyUserPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'FINISHED',
    "cheddrAmount" DECIMAL(78,0) NOT NULL,
    "userId" UUID,
    "txId" TEXT,
    "receiverAddress" TEXT,
    "channelId" TEXT,
    "sequenceNumber" INTEGER,
    "note" TEXT NOT NULL,
    "txCategory" "TxCategory",

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaChingNotification" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,
    "transactionId" UUID NOT NULL,
    "received" TIMESTAMP(3),
    "message" TEXT NOT NULL,

    CONSTRAINT "CaChingNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConfirmation" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "confirm_email_code" TEXT,
    "confirm_email_code_sent" TIMESTAMP(3),
    "confirm_email_code_timelimit" TIMESTAMP(3),
    "confirm_phone_code" TEXT,
    "confirm_phone_code_sent" TIMESTAMP(3),
    "confirm_phone_code_timelimit" TIMESTAMP(3),
    "reset_code" TEXT,
    "reset_code_timelimit" TIMESTAMP(3),
    "change_email_to" TEXT,
    "change_email_code" TEXT,
    "change_email_code_timelimit" TIMESTAMP(3),
    "magic_login_code" TEXT,
    "magic_login_code_timelimit" TIMESTAMP(3),

    CONSTRAINT "UserConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "image_id" UUID,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "categoryId" UUID NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "vendor_id" UUID NOT NULL,
    "image_id" UUID,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" UUID NOT NULL,
    "menu_item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShoppingCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" UUID NOT NULL,
    "menuItemId" UUID NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "totalAmount" INTEGER NOT NULL,
    "cheddrAmount" DECIMAL(78,0) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "vendorConfirmation" "VendorConfirmation" NOT NULL DEFAULT 'INITIAL',
    "vendorId" UUID NOT NULL,
    "transactioinId" UUID,
    "userId" UUID,
    "orderType" "OrderType" NOT NULL,
    "rotatingId" TEXT NOT NULL DEFAULT '000',
    "pickup_location" TEXT,
    "pickup_time" TEXT,
    "pickup_day" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileId" UUID,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diskName" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "uploader_user_id" UUID,
    "fileFormat" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageVariation" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalImageId" UUID NOT NULL,
    "size" "ImageSize" NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileId" UUID NOT NULL,
    "resolutionWidth" INTEGER,
    "resolutionHeight" INTEGER,
    "aspectRatio" DOUBLE PRECISION,
    "fileFormat" TEXT,

    CONSTRAINT "ImageVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorSchedule" (
    "id" UUID NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "active_days" "Weekday"[],
    "company_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VendorSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "category_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" UUID NOT NULL,
    "subcategory_name" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafeWallet" (
    "id" UUID NOT NULL,
    "server_salt" TEXT NOT NULL,
    "safeWalletAddress" TEXT NOT NULL,
    "user_EOA_address" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "siweNonce" TEXT,

    CONSTRAINT "SafeWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "channelId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "balance" DECIMAL(78,0) NOT NULL,
    "expiryTimestamp" INTEGER NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "userSignature" TEXT NOT NULL,
    "sequencerSignature" TEXT NOT NULL,
    "signatureTimestamp" INTEGER NOT NULL,
    "status" "ChannelStatus" NOT NULL,
    "channelClosureJobId" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelRecipient" (
    "id" UUID NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "balance" DECIMAL(78,0) NOT NULL,
    "channelId" UUID NOT NULL,

    CONSTRAINT "ChannelRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "key" "PreferenceKey" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileToMenuItem" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FileToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FileToVendor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ImageVariationToVendor" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "WeeklyPayout_created_at_idx" ON "WeeklyPayout"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "CpcEmployee_user_id_key" ON "CpcEmployee"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyUserPayout_transaction_id_key" ON "WeeklyUserPayout"("transaction_id");

-- CreateIndex
CREATE INDEX "Transaction_receiverAddress_userId_created_at_idx" ON "Transaction"("receiverAddress", "userId", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "CaChingNotification_transactionId_key" ON "CaChingNotification"("transactionId");

-- CreateIndex
CREATE INDEX "CaChingNotification_userId_received_idx" ON "CaChingNotification"("userId", "received");

-- CreateIndex
CREATE UNIQUE INDEX "UserConfirmation_user_id_key" ON "UserConfirmation"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_user_id_key" ON "Vendor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_user_id_menu_item_id_key" ON "ShoppingCart"("user_id", "menu_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_transactioinId_key" ON "Order"("transactioinId");

-- CreateIndex
CREATE UNIQUE INDEX "SafeWallet_safeWalletAddress_key" ON "SafeWallet"("safeWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "SafeWallet_user_EOA_address_key" ON "SafeWallet"("user_EOA_address");

-- CreateIndex
CREATE UNIQUE INDEX "SafeWallet_user_id_key" ON "SafeWallet"("user_id");

-- CreateIndex
CREATE INDEX "SafeWallet_user_EOA_address_idx" ON "SafeWallet"("user_EOA_address");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelId_key" ON "Channel"("channelId");

-- CreateIndex
CREATE INDEX "Channel_owner_status_idx" ON "Channel"("owner", "status");

-- CreateIndex
CREATE INDEX "ChannelRecipient_recipientAddress_idx" ON "ChannelRecipient"("recipientAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelRecipient_recipientAddress_channelId_key" ON "ChannelRecipient"("recipientAddress", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key_key" ON "Preference"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToMenuItem_AB_unique" ON "_FileToMenuItem"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToMenuItem_B_index" ON "_FileToMenuItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToUser_AB_unique" ON "_FileToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToUser_B_index" ON "_FileToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToVendor_AB_unique" ON "_FileToVendor"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToVendor_B_index" ON "_FileToVendor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ImageVariationToVendor_AB_unique" ON "_ImageVariationToVendor"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageVariationToVendor_B_index" ON "_ImageVariationToVendor"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CpcEmployee" ADD CONSTRAINT "CpcEmployee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyUserPayout" ADD CONSTRAINT "WeeklyUserPayout_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "CpcEmployee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyUserPayout" ADD CONSTRAINT "WeeklyUserPayout_payout_id_fkey" FOREIGN KEY ("payout_id") REFERENCES "WeeklyPayout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyUserPayout" ADD CONSTRAINT "WeeklyUserPayout_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaChingNotification" ADD CONSTRAINT "CaChingNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaChingNotification" ADD CONSTRAINT "CaChingNotification_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConfirmation" ADD CONSTRAINT "UserConfirmation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_transactioinId_fkey" FOREIGN KEY ("transactioinId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploader_user_id_fkey" FOREIGN KEY ("uploader_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageVariation" ADD CONSTRAINT "ImageVariation_originalImageId_fkey" FOREIGN KEY ("originalImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageVariation" ADD CONSTRAINT "ImageVariation_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorSchedule" ADD CONSTRAINT "VendorSchedule_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafeWallet" ADD CONSTRAINT "SafeWallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelRecipient" ADD CONSTRAINT "ChannelRecipient_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToMenuItem" ADD CONSTRAINT "_FileToMenuItem_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToMenuItem" ADD CONSTRAINT "_FileToMenuItem_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToUser" ADD CONSTRAINT "_FileToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToUser" ADD CONSTRAINT "_FileToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToVendor" ADD CONSTRAINT "_FileToVendor_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToVendor" ADD CONSTRAINT "_FileToVendor_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageVariationToVendor" ADD CONSTRAINT "_ImageVariationToVendor_A_fkey" FOREIGN KEY ("A") REFERENCES "ImageVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageVariationToVendor" ADD CONSTRAINT "_ImageVariationToVendor_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
