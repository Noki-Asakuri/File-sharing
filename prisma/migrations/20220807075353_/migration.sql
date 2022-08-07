-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_authorID_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("discordID") ON DELETE CASCADE ON UPDATE CASCADE;
