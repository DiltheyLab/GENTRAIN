/*
  Warnings:

  - You are about to drop the column `scheme_name` on the `pathogen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pathogen" DROP COLUMN "scheme_name",
ADD COLUMN     "scheme_version" TIMESTAMP(6);
