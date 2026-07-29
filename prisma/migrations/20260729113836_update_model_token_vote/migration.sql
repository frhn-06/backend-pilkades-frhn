/*
  Warnings:

  - A unique constraint covering the columns `[electionId,token]` on the table `TokenVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TokenVote_electionId_token_key" ON "TokenVote"("electionId", "token");
