/*
  Warnings:

  - You are about to drop the column `desa` on the `Election` table. All the data in the column will be lost.
  - You are about to drop the column `kabupatenKota` on the `Election` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatan` on the `Election` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi` on the `Election` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Election" DROP COLUMN "desa",
DROP COLUMN "kabupatenKota",
DROP COLUMN "kecamatan",
DROP COLUMN "provinsi",
ADD COLUMN     "organizerInfo" TEXT,
ADD COLUMN     "organizerName" TEXT;
