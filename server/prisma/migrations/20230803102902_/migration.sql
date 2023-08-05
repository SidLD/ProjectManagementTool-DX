-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_projectId_fkey`;

-- AlterTable
ALTER TABLE `teammember` MODIFY `projectId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TeamMember` ADD CONSTRAINT `TeamMember_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
