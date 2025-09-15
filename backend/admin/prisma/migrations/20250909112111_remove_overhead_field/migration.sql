/*
  Warnings:

  - You are about to drop the column `example_data_file_path` on the `pathogen` table. All the data in the column will be lost.
  - You are about to drop the column `example_data_files_to_delete` on the `pathogen` table. All the data in the column will be lost.
  - You are about to drop the column `example_data_mime_type` on the `pathogen` table. All the data in the column will be lost.
  - You are about to drop the column `exmaple_data_file_name` on the `pathogen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pathogen" DROP COLUMN "example_data_file_path",
DROP COLUMN "example_data_files_to_delete",
DROP COLUMN "example_data_mime_type",
DROP COLUMN "exmaple_data_file_name";
