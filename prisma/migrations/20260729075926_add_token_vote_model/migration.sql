-- CreateTable
CREATE TABLE "TokenVote" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expired" TIMESTAMP(3) NOT NULL,
    "useAt" TIMESTAMP(3),
    "electionId" INTEGER NOT NULL,
    "tpsId" INTEGER NOT NULL,
    "voterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenVote_token_idx" ON "TokenVote"("token");

-- CreateIndex
CREATE INDEX "TokenVote_voterId_idx" ON "TokenVote"("voterId");

-- CreateIndex
CREATE INDEX "TokenVote_electionId_tpsId_idx" ON "TokenVote"("electionId", "tpsId");

-- CreateIndex
CREATE INDEX "TokenVote_electionId_tpsId_voterId_token_idx" ON "TokenVote"("electionId", "tpsId", "voterId", "token");

-- AddForeignKey
ALTER TABLE "TokenVote" ADD CONSTRAINT "TokenVote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenVote" ADD CONSTRAINT "TokenVote_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "Tps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenVote" ADD CONSTRAINT "TokenVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
