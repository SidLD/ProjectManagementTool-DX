/*
  Warnings:

  - You are about to drop the column `createdAt` on the `mention` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `mention` table. All the data in the column will be lost.
  - Added the required column `status` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mention` DROP COLUMN `createdAt`,
    DROP COLUMN `isRead`;

-- AlterTable
ALTER TABLE `teammember` ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED') NOT NULL;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('MENTION', 'REPLY', 'INVITATION') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isRead` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
