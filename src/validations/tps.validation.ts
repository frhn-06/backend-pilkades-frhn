import zod from 'zod'

const tpsDTO = zod.object({
    name: zod.string().trim().min(3).max(20),
    location: zod.string().trim().min(2).max(100),
});


export {tpsDTO}