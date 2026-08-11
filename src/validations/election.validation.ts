import { ElectionStatus } from '@prisma/client';
import zod from 'zod';

const electionDTO = zod.object({
    name: zod.string().trim().max(100),
    organizerName: zod.string().trim().max(100).transform(value => value === "" ? null : value).optional(),
    organizerInfo: zod.string().trim().max(100).transform(value => value === "" ? null : value).optional(),
    startAt: zod.coerce.date(),
    endAt: zod.coerce.date(),
    logo: zod.string().optional(),
    description: zod.string().transform(value => value === "" ? null : value).optional()
})


const statusDTO = zod.object({
    status: zod.enum(ElectionStatus)
})

export {electionDTO, statusDTO};