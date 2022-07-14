-- DropIndex
DROP INDEX "File_authorID_key";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "type" DROP NOT NULL;
