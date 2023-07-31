/*
  Warnings:

  - You are about to drop the column `userId` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `_TaskToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TaskToUser_AB_unique`(`A`, `B`),
    INDEX `_TaskToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TaskToUser` ADD CONSTRAINT `_TaskToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TaskToUser` ADD CONSTRAINT `_TaskToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
