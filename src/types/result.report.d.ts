import { ElectionStatus } from "@prisma/client";

interface IElectionResult {
    id: number;
    name: string;
    organizerInfo: string | null;
    organizerName: string | null;
    logo: string | null;
    startAt: Date;
    endAt: Date;
    status: ElectionStatus
}

interface ICandidatesResult  {
    id: number;
    nomor: number;
    members: {name: string}[];
    totalVote: number;
    percentage: number;
}

interface ISummaryResult  {
    countVoters: number;
    countVotersPresent: number;
    countVotersAbsen: number;
    countVotersVote: number;
    countVotersNotVote: number;
    parcitipantsRate: number;
}

interface IResultReport {
    election : IElectionResult;
    candidates: ICandidatesResult[];
    summary: ISummaryResult;
    exportAt: Date;
}



export type {IResultReport, IElectionResult, ICandidatesResult, ISummaryResult}