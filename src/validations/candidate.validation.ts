import zod, {z} from 'zod';

const candidateMemberDTO = zod.object({
    name: z.string().trim().min(1).max(100),
    position: z.string().trim().min(1).max(50),
    order: z.number().int().positive(),
    img: z.string().trim().optional()
})

const candidateDTO = zod.object({
    nomor: z.number().int().positive(),
    vision: z.string().trim().min(1),
    mission: z.string().trim().min(1),
    img: z.string().trim(),
    members: z.array(candidateMemberDTO).min(1)

})
export {candidateDTO};