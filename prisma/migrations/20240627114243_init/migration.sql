/*
  Warnings:

  - You are about to drop the `entrances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `entrances`;

-- DropTable
DROP TABLE `exits`;

-- CreateTable
CREATE TABLE `Entrance` (
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exit` (
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
