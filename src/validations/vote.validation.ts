import zod, {z} from 'zod'

const voteDTO = zod.object({
    token: z.string().length(6, "Harus mengandung 6 karakter").trim(),
    candidateId: z.int().min(1)
})

export {voteDTO}