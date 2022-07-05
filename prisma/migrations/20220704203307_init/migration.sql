/*
  Warnings:

  - Added the required column `name` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "name" TEXT NOT NULL;
