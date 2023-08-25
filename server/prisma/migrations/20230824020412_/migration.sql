/*
  Warnings:

  - You are about to drop the column `notificationId` on the `mention` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mentionId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `mention` DROP FOREIGN KEY `Mention_notificationId_fkey`;

-- AlterTable
ALTER TABLE `mention` DROP COLUMN `notificationId`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `mentionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Notification_mentionId_key` ON `Notification`(`mentionId`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_mentionId_fkey` FOREIGN KEY (`mentionId`) REFERENCES `Mention`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
