-- CreateTable
CREATE TABLE "pathogens" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "genetic_distance_threshold" INTEGER NOT NULL,
    "type" VARCHAR NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "scheme_version" TIMESTAMP(6),
    "scheme_size" BIGINT,
    "example_cases_key" VARCHAR,
    "example_cases_size" INTEGER,
    "example_cases_bucket" TEXT,
    "example_sequences_key" VARCHAR,
    "example_sequences_size" INTEGER,
    "example_sequences_bucket" TEXT,
    "example_contacts_key" VARCHAR,
    "example_contacts_size" INTEGER,
    "example_contacts_bucket" TEXT,

    CONSTRAINT "pathogens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80),
    "description" VARCHAR(255),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(255),
    "confirmed_at" TIMESTAMP(6),
    "username" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordId" INTEGER NOT NULL,
    "recordTitle" VARCHAR(128),
    "difference" JSON,
    "action" VARCHAR(128) NOT NULL,
    "resource" VARCHAR(128) NOT NULL,
    "userId" VARCHAR(128) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "sessions"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
