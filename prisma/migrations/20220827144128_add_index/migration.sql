-- AlterTable
ALTER TABLE "File" ADD COLUMN     "unlockedUser" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "File_fileID_idx" ON "File"("fileID");
