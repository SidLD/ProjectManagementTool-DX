/*
  Warnings:

  - You are about to drop the column `notificationId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `teammember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commentId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_notificationId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `notificationId`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `commentId` VARCHAR(191) NULL,
    ADD COLUMN `teamId` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teammember` DROP COLUMN `notificationId`;

-- CreateIndex
CREATE UNIQUE INDEX `Notification_teamId_key` ON `Notification`(`teamId`);

-- CreateIndex
CREATE UNIQUE INDEX `Notification_commentId_key` ON `Notification`(`commentId`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `TeamMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
