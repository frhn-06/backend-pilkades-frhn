/*
  Warnings:

  - You are about to drop the column `kabupaten` on the `Election` table. All the data in the column will be lost.
  - Added the required column `kabupatenKota` to the `Election` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Election" DROP COLUMN "kabupaten",
ADD COLUMN     "kabupatenKota" TEXT NOT NULL;
