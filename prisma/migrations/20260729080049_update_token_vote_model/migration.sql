/*
  Warnings:

  - You are about to drop the column `expired` on the `TokenVote` table. All the data in the column will be lost.
  - You are about to drop the column `useAt` on the `TokenVote` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `TokenVote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TokenVote_electionId_tpsId_voterId_token_idx";

-- AlterTable
ALTER TABLE "TokenVote" DROP COLUMN "expired",
DROP COLUMN "useAt",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3);
