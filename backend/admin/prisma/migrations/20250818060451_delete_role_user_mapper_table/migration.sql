/*
  Warnings:

  - You are about to drop the `roles_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "roles_users" DROP CONSTRAINT "roles_users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "roles_users" DROP CONSTRAINT "roles_users_user_id_fkey";

-- DropTable
DROP TABLE "roles_users";
