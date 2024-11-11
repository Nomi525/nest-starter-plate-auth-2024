-- CreateTable
CREATE TABLE "Manager" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "image_id" UUID,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileToManager" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ImageVariationToManager" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_user_id_key" ON "Manager"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToManager_AB_unique" ON "_FileToManager"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToManager_B_index" ON "_FileToManager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ImageVariationToManager_AB_unique" ON "_ImageVariationToManager"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageVariationToManager_B_index" ON "_ImageVariationToManager"("B");

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToManager" ADD CONSTRAINT "_FileToManager_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToManager" ADD CONSTRAINT "_FileToManager_B_fkey" FOREIGN KEY ("B") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageVariationToManager" ADD CONSTRAINT "_ImageVariationToManager_A_fkey" FOREIGN KEY ("A") REFERENCES "ImageVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageVariationToManager" ADD CONSTRAINT "_ImageVariationToManager_B_fkey" FOREIGN KEY ("B") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
