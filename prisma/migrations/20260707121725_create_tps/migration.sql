/*
  Warnings:

  - The values [TPS] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'PETUGAS');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- CreateTable
CREATE TABLE "Tps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" INTEGER NOT NULL,
    "rw" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "Tps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
