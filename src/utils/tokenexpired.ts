const generateExpired = (now: Date, selisih: number) => {
    const time = now.getTime();
    const timePlusSelisih = time + selisih;

    const result = new Date(timePlusSelisih);

    return result;
}

export {generateExpired};