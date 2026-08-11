/*
  Warnings:

  - You are about to drop the column `alamat` on the `Tps` table. All the data in the column will be lost.
  - You are about to drop the column `rt` on the `Tps` table. All the data in the column will be lost.
  - You are about to drop the column `rw` on the `Tps` table. All the data in the column will be lost.
  - Added the required column `location` to the `Tps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tps" DROP COLUMN "alamat",
DROP COLUMN "rt",
DROP COLUMN "rw",
ADD COLUMN     "location" TEXT NOT NULL;
