/*
  Warnings:

  - You are about to drop the column `scheme_id` on the `pathogen` table. All the data in the column will be lost.
  - You are about to drop the `scheme` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pathogen" DROP CONSTRAINT "pathogen_scheme_id_fkey";

-- AlterTable
ALTER TABLE "pathogen" DROP COLUMN "scheme_id";

-- DropTable
DROP TABLE "scheme";
