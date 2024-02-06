const checkRegInfo = async (userData) => {
    const { firstName, lastName, email, password, passwordRepeat } = userData;

        const inputErrors = [0, 0, 0, 0, 0];

        const nameRegex = /^[A-Za-z\s]+$/;
        const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*\d).{6,}$/;
    
        inputErrors[0] = nameRegex.test(firstName) ? 1 : 0;
        inputErrors[1] = nameRegex.test(lastName) ? 1 : 0;
        inputErrors[3] = passRegex.test(password) ? 1 : 0;
        inputErrors[4] = passwordRepeat === password ? 1 : 0;
    
        return inputErrors;    
}

module.exports = checkRegInfo;
