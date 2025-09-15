/*
  Warnings:

  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "file";

-- CreateTable
CREATE TABLE "log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordId" INTEGER NOT NULL,
    "recordTitle" VARCHAR(128),
    "difference" JSON,
    "action" VARCHAR(128) NOT NULL,
    "resource" VARCHAR(128) NOT NULL,
    "userId" VARCHAR(128) NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);
