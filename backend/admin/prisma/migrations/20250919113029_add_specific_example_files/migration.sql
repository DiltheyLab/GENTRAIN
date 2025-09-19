/*
  Warnings:

  - You are about to drop the column `example_data_bucket` on the `pathogen` table. All the data in the column will be lost.
  - You are about to drop the column `example_data_key` on the `pathogen` table. All the data in the column will be lost.
  - You are about to drop the column `example_data_size` on the `pathogen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pathogen" DROP COLUMN "example_data_bucket",
DROP COLUMN "example_data_key",
DROP COLUMN "example_data_size",
ADD COLUMN     "example_cases_bucket" TEXT,
ADD COLUMN     "example_cases_key" VARCHAR,
ADD COLUMN     "example_cases_size" INTEGER,
ADD COLUMN     "example_contacts_bucket" TEXT,
ADD COLUMN     "example_contacts_key" VARCHAR,
ADD COLUMN     "example_contacts_size" INTEGER,
ADD COLUMN     "example_sequences_bucket" TEXT,
ADD COLUMN     "example_sequences_key" VARCHAR,
ADD COLUMN     "example_sequences_size" INTEGER;
