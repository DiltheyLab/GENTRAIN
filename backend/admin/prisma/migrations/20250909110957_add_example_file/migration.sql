-- AlterTable
ALTER TABLE "pathogen" ADD COLUMN     "example_data_bucket" TEXT,
ADD COLUMN     "example_data_files_to_delete" TEXT,
ADD COLUMN     "example_data_key" VARCHAR,
ADD COLUMN     "example_data_size" INTEGER,
ADD COLUMN     "exmaple_data_file_name" TEXT,
ADD COLUMN     "exmaple_data_mime_type" TEXT;
