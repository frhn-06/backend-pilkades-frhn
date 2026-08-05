const generateTokenVote = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export {generateTokenVote, generateOtp};