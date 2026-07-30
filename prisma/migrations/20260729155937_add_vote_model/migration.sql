-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "electionId" INTEGER NOT NULL,
    "voterId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "tpsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vote_electionId_idx" ON "Vote"("electionId");

-- CreateIndex
CREATE INDEX "Vote_candidateId_idx" ON "Vote"("candidateId");

-- CreateIndex
CREATE INDEX "Vote_tpsId_idx" ON "Vote"("tpsId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_electionId_voterId_key" ON "Vote"("electionId", "voterId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "Tps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
