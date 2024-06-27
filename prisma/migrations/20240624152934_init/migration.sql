/*
  Warnings:

  - The primary key for the `entrances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discordId` on the `entrances` table. All the data in the column will be lost.
  - The primary key for the `exits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discordId` on the `exits` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Entrances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Exits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `entrances` DROP PRIMARY KEY,
    DROP COLUMN `discordId`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `exits` DROP PRIMARY KEY,
    DROP COLUMN `discordId`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`);
