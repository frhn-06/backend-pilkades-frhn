import prisma from "../libs/prisma"

const reportService = {
    result: async (electionId: number) => {
        const data = await prisma.$transaction(async(tx) => {
            const election = await tx.election.findUnique({
                where: {
                    id: electionId
                },
                select: {
                    id: true,
                    name: true,
                    desa: true,
                    kecamatan: true,
                    kabupatenKota: true,
                    provinsi: true,
                    logo: true,
                    startAt: true,
                    endAt: true,
                    status: true
                }
            })

            if(!election) throw new Error("Election tidak ditemukan");

            const countVoters = await tx.voter.count({
                where: {
                    electionId: electionId,
                }
            })

            const countVotersPresent = await tx.voter.count({
                where: {
                    electionId: electionId,
                    isPresent: true
                }
            })
            
            const countVotersVote = await tx.voter.count({
                where: {
                    electionId: electionId,
                    isVoted: true
                }
            })

            const candidates = await tx.candidate.findMany({
                where: {
                    electionId: electionId
                },
                select: {
                    id: true,
                    nomor: true,
                    members: {
                         select: {
                             name: true
                         }
                    },
                }
            });

            const votesGroup = await tx.vote.groupBy({
                by: ["candidateId"],
                where: {
                    electionId: electionId
                },
                _count: true
            });

            const candidResult = candidates.map((candid) => {
                const vote = votesGroup.find(vote => vote.candidateId === candid.id);
                const totalVote = vote?._count ?? 0;
                return {
                    ...candid,
                    totalVote,
                    percentage: countVotersVote === 0 ? 0 : Number((totalVote * 100 / countVotersVote).toFixed(2))
                }
            })



            return {
                election,
                candidates: candidResult,
                summary: {
                    countVoters,
                    countVotersPresent,
                    countVotersAbsen: countVoters - countVotersPresent,
                    countVotersVote,
                    countVotersNotVote: countVotersPresent - countVotersVote,
                    parcitipantsRate: countVotersPresent === 0 ? 0 : Number((countVotersPresent * 100 / countVoters).toFixed(1))
                },
                exportAt: new Date()
            }
        })

        return data
    }
}

export default reportService;