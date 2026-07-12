import zod from 'zod';

const electionDTO = zod.object({
    name: zod.string().trim().max(100),
    desa: zod.string().trim().max(100),
    kecamatan: zod.string().trim().max(100),
    kabupatenKota: zod.string().trim().max(100),
    provinsi: zod.string().trim().max(100),
    startAt: zod.coerce.date(),
    endAt: zod.coerce.date(),
    logo: zod.string().optional(),
    description: zod.string().optional()
})

export {electionDTO};