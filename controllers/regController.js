const checkRegInfo = (userData) => {
    const { firstName, lastName, email, password, passwordRepeat } = userData;
    const inputErrors = [0, 0, 0, 0, 0];
    
    const nameRegex = /^[A-Za-z\s]+$/;
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*\d).{6,}$/;

    inputErrors[0] = nameRegex.test(firstName) ? 0 : 1;
    inputErrors[1] = nameRegex.test(lastName) ? 0 : 1;
    inputErrors[3] = passRegex.test(password) ? 0 : 1;
    inputErrors[4] = passwordRepeat === password ? 0 : 1;

    return inputErrors;
}

module.exports = checkRegInfo;
