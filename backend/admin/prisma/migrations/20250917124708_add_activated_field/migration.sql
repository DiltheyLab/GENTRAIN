/*
  Warnings:

  - Added the required column `activated` to the `pathogen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pathogen" ADD COLUMN     "activated" BOOLEAN NOT NULL;
