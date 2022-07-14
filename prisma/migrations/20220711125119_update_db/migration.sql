/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorID]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorID` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordID` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileUrl",
ADD COLUMN     "authorID" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_authorID_key" ON "File"("authorID");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordID_key" ON "User"("discordID");
