/*
  Warnings:

  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_tasktouser` DROP FOREIGN KEY `_TaskToUser_A_fkey`;

-- AlterTable
ALTER TABLE `_tasktouser` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `task` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `_TaskToUser` ADD CONSTRAINT `_TaskToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
