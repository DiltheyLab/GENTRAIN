/*
  Warnings:

  - You are about to drop the column `exmaple_data_mime_type` on the `pathogen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pathogen" DROP COLUMN "exmaple_data_mime_type",
ADD COLUMN     "example_data_mime_type" TEXT;
