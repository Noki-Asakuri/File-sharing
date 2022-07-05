-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "password" TEXT,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);
