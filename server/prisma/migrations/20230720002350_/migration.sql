-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_roleId_fkey`;

-- AlterTable
ALTER TABLE `permission` MODIFY `roleId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
