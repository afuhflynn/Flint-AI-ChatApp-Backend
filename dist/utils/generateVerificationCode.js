const generateVerificationCode = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
};
export default generateVerificationCode;
//# sourceMappingURL=generateVerificationCode.js.map