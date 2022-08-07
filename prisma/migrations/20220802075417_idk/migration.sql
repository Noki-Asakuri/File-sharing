/*
  Warnings:

  - You are about to drop the column `role` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileID]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "File_fileID_key" ON "File"("fileID");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("discordID") ON DELETE RESTRICT ON UPDATE CASCADE;
