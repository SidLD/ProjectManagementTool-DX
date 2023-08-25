/*
  Warnings:

  - Added the required column `notificationId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationId` to the `Mention` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notificationId` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `notificationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `mention` ADD COLUMN `notificationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teammember` ADD COLUMN `notificationId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TeamMember` ADD CONSTRAINT `TeamMember_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mention` ADD CONSTRAINT `Mention_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
