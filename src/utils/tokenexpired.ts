const generateExpired = (selisih: number) => {
    const now = new Date();
    const time = now.getTime();
    const timePlusSelisih = time + selisih;

    const result = new Date(timePlusSelisih);

    return result;
}

export {generateExpired};