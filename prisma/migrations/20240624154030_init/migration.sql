/*
  Warnings:

  - The primary key for the `entrances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exits` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `entrances` DROP PRIMARY KEY,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `exits` DROP PRIMARY KEY,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`);
