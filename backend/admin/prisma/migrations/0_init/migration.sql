-- CreateTable
CREATE TABLE "alembic_version" (
    "version_num" VARCHAR(32) NOT NULL,

    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
);

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
CREATE TABLE "roles_users" (
    "user_id" INTEGER,
    "role_id" INTEGER
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

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_fs_uniquifier_key" ON "user"("fs_uniquifier");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "roles_users" ADD CONSTRAINT "roles_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles_users" ADD CONSTRAINT "roles_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

