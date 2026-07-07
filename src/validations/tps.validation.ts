import zod from 'zod'

const tpsDTO = zod.object({
    name: zod.string().trim().min(3).max(20),
    alamat: zod.string().trim().min(2).max(100),
    rt: zod.number(),
    rw: zod.number(),
});


export {tpsDTO}