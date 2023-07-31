-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `Logs_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `Logs_userId_fkey`;

-- AlterTable
ALTER TABLE `logs` MODIFY `taskId` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
