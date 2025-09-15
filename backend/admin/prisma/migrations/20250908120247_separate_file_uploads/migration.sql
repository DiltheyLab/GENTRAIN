-- CreateTable
CREATE TABLE "pathogen" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "genetic_distance_threshold" INTEGER NOT NULL,
    "type" VARCHAR NOT NULL,
    "scheme_name" VARCHAR NOT NULL,

    CONSTRAINT "pathogen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80),
    "description" VARCHAR(255),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(255),
    "active" BOOLEAN,
    "confirmed_at" TIMESTAMP(6),
    "fs_uniquifier" VARCHAR(64) NOT NULL,
    "username" VARCHAR,
    "last_login_at" TIMESTAMP(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "key" VARCHAR,
    "path" VARCHAR,
    "size" INTEGER,
    "bucket" TEXT,
    "mime_type" TEXT,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "user_fs_uniquifier_key" ON "user"("fs_uniquifier");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
