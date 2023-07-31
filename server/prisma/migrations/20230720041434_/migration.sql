/*
  Warnings:

  - Made the column `roleId` on table `permission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_roleId_fkey`;

-- DropIndex
DROP INDEX `Permission_name_key` ON `permission`;

-- AlterTable
ALTER TABLE `permission` MODIFY `roleId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
