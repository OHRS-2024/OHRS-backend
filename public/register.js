const onSubmit = async (e) =>{
    const form = document.querySelector('form');

    e.preventDefault();
    const {firstName, lastName, email, gender, password, passwordRepeat} = form;

    try {
        const res = await fetch('/auth/register', { 
            body: JSON.stringify({   
            'firstName' : firstName.value, 
            'lastName' : lastName.value, 
            'email' : email.value, 
            'gender' : gender.value, 
            'password' : password.value,
            'passwordRepeat' : passwordRepeat.value,
        }),
            headers : {"Content-Type": 'application/json'},

            method : 'POST'
            })
            .then(res => console.log(res))
            .catch(err => console.error(err)); 

    } catch (error) {
        console.log(error); 
    }
}