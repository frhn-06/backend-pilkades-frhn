const publishJson = (result: any) => {
    const {password, ...data} = result;
    return data;
}

const publishManyJson = (result: any[]) => {
    const array = result.map((r) => {
        const {password, ...data} = r;
        return data;
    })
    return array;
}

export {publishJson, publishManyJson};