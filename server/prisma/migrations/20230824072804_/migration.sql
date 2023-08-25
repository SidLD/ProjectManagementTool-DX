/*
  Warnings:

  - You are about to drop the `_mentiontouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_mentiontouser` DROP FOREIGN KEY `_MentionToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_mentiontouser` DROP FOREIGN KEY `_MentionToUser_B_fkey`;

-- AlterTable
ALTER TABLE `mention` ADD COLUMN `userId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_mentiontouser`;

-- AddForeignKey
ALTER TABLE `Mention` ADD CONSTRAINT `Mention_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
