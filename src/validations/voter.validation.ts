import zod, {z} from 'zod';

const voterDTO = zod.object({
    name: z.string().trim().min(2).max(100),
    nik: z.string().trim().max(16).optional(),
    info: z.string().trim().max(100).optional()
});

export {voterDTO};