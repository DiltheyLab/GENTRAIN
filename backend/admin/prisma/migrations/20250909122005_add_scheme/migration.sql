-- AlterTable
ALTER TABLE "pathogen" ADD COLUMN     "scheme_id" INTEGER;

-- CreateTable
CREATE TABLE "scheme" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "scheme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pathogen" ADD CONSTRAINT "pathogen_scheme_id_fkey" FOREIGN KEY ("scheme_id") REFERENCES "scheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
