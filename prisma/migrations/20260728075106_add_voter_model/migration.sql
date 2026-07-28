-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nik" TEXT,
    "info" TEXT,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "isVoted" BOOLEAN NOT NULL DEFAULT false,
    "electionId" INTEGER NOT NULL,
    "tpsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Voter_electionId_tpsId_idx" ON "Voter"("electionId", "tpsId");

-- CreateIndex
CREATE INDEX "Voter_electionId_tpsId_isPresent_idx" ON "Voter"("electionId", "tpsId", "isPresent");

-- CreateIndex
CREATE INDEX "Voter_electionId_tpsId_isVoted_idx" ON "Voter"("electionId", "tpsId", "isVoted");

-- CreateIndex
CREATE UNIQUE INDEX "Voter_electionId_nik_key" ON "Voter"("electionId", "nik");

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "Tps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
