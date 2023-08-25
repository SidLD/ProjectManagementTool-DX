/*
  Warnings:

  - A unique constraint covering the columns `[notificationId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notificationId]` on the table `Mention` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notificationId]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `mention` DROP FOREIGN KEY `Mention_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_notificationId_fkey`;

-- AlterTable
ALTER TABLE `comment` MODIFY `notificationId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `mention` MODIFY `notificationId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teammember` MODIFY `notificationId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Comment_notificationId_key` ON `Comment`(`notificationId`);

-- CreateIndex
CREATE UNIQUE INDEX `Mention_notificationId_key` ON `Mention`(`notificationId`);

-- CreateIndex
CREATE UNIQUE INDEX `TeamMember_notificationId_key` ON `TeamMember`(`notificationId`);

-- AddForeignKey
ALTER TABLE `TeamMember` ADD CONSTRAINT `TeamMember_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mention` ADD CONSTRAINT `Mention_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
