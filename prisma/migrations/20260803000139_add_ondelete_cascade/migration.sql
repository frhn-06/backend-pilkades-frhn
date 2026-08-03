-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_electionId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateMember" DROP CONSTRAINT "CandidateMember_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateMember" DROP CONSTRAINT "CandidateMember_electionId_fkey";

-- DropForeignKey
ALTER TABLE "TokenVote" DROP CONSTRAINT "TokenVote_electionId_fkey";

-- DropForeignKey
ALTER TABLE "TokenVote" DROP CONSTRAINT "TokenVote_tpsId_fkey";

-- DropForeignKey
ALTER TABLE "TokenVote" DROP CONSTRAINT "TokenVote_voterId_fkey";

-- DropForeignKey
ALTER TABLE "Tps" DROP CONSTRAINT "Tps_electionId_fkey";

-- DropForeignKey
ALTER TABLE "Voter" DROP CONSTRAINT "Voter_electionId_fkey";

-- DropForeignKey
ALTER TABLE "Voter" DROP CONSTRAINT "Voter_tpsId_fkey";

-- AddForeignKey
ALTER TABLE "Tps" ADD CONSTRAINT "Tps_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateMember" ADD CONSTRAINT "CandidateMember_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateMember" ADD CONSTRAINT "CandidateMember_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "Tps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenVote" ADD CONSTRAINT "TokenVote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenVote" ADD CONSTRAINT "TokenVote_tpsId_fkey" FOREIGN KEY ("tpsId") REFERENCES "Tps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenVote" ADD CONSTRAINT "TokenVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
