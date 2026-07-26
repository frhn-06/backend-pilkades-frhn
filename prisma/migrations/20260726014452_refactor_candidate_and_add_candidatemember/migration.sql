/*
  Warnings:

  - You are about to drop the column `name` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_urut` on the `Candidate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[electionId,nomor]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomor` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Candidate_electionId_nomor_urut_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "name",
DROP COLUMN "nomor_urut",
ADD COLUMN     "nomor" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CandidateMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "position" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "electionId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateMember_electionId_idx" ON "CandidateMember"("electionId");

-- CreateIndex
CREATE INDEX "CandidateMember_candidateId_idx" ON "CandidateMember"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateMember_position_candidateId_key" ON "CandidateMember"("position", "candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_electionId_nomor_key" ON "Candidate"("electionId", "nomor");

-- AddForeignKey
ALTER TABLE "CandidateMember" ADD CONSTRAINT "CandidateMember_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateMember" ADD CONSTRAINT "CandidateMember_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
