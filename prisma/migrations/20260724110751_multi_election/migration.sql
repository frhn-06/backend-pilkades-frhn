/*
  Warnings:

  - Added the required column `electionId` to the `Tps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tps" ADD COLUMN     "electionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "electionId" INTEGER;

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "nomor_urut" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "electionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Candidate_electionId_idx" ON "Candidate"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_electionId_nomor_urut_key" ON "Candidate"("electionId", "nomor_urut");

-- CreateIndex
CREATE INDEX "Tps_electionId_idx" ON "Tps"("electionId");

-- CreateIndex
CREATE INDEX "User_electionId_isActive_idx" ON "User"("electionId", "isActive");

-- CreateIndex
CREATE INDEX "User_electionId_idx" ON "User"("electionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tps" ADD CONSTRAINT "Tps_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
